package ti.dabble.services.paypal;

import com.github.f4b6a3.uuid.UuidCreator;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import ti.dabble.entities.*;
import ti.dabble.entities.Image;
import ti.dabble.entities.Payment;
import ti.dabble.enums.NotificationType;
import ti.dabble.enums.PaymentGateway;
import ti.dabble.enums.PaymentStatus;
import ti.dabble.enums.TransactionType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.repositories.*;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.CreatePaymentRequest;
import ti.dabble.requests.PaymentExecuteRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;
import ti.dabble.services.user_subscription.IUserSubscriptionService;
import ti.dabble.services.wallet.WalletService;
import ti.dabble.services.wallet_transaction.IWalletTransactionService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PayPalService implements IPayPalService {

    @Autowired
    private APIContext apiContext;
    @Autowired
    private IUserSubscriptionService userSubscriptionService;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubscriptionPlanRepository planRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;
    @Autowired
    private FeeRepository feeRepository;
    @Autowired
    private WalletService walletService;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private IWalletTransactionService walletTransactionService;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    @Autowired
    private UserPurchasedImageRepository userPurchasedImageRepository;

    @Override
    @Transactional
    public StatusObject<String> createPaymentUrl(
            CreatePaymentRequest createPaymentRequest,
            String userEmail,
            String checkPaymentUrl) {
        StatusObject<String> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }

            Payment localPayment = new Payment();
            // 3. Config PayPal Request
            Amount amount = new Amount();
            amount.setCurrency("USD");
            switch (createPaymentRequest.getType()) {
                case PURCHASE -> {
                    if (createPaymentRequest.getReferenceId() == null || createPaymentRequest.getReferenceId()
                            .isEmpty()) {
                        statusObject.setErrorMessage("Reference ID must be required in this type");
                        return statusObject;
                    }
                    Image image = imageRepository.findImageById(UUID.fromString(createPaymentRequest.getReferenceId()));
                    if (image == null) {
                        statusObject.setErrorMessage("Pay failed because image not found");
                        return statusObject;
                    }
                    boolean isBlocked = contactRepository.hasBlockedRelationship(user.getId(),
                            image.getCreator().getId());
                    if (isBlocked) {
                        statusObject
                                .setErrorMessage("Pay failed because you have blocked or been blocked by the creator");
                        return statusObject;
                    }
                    Wallet walletOfBuyer = walletRepository.findWalletByUserId(user.getId());
                    if (walletOfBuyer != null) {
                        boolean isPurchased = walletTransactionRepository
                                .existByWalletIdAndTransactionTypeAndReferenceId(
                                        walletOfBuyer.getId(),
                                        TransactionType.PURCHASE,
                                        image.getId());

                        if (isPurchased) {
                            statusObject.setErrorMessage("You have already bought this image");
                            return statusObject;
                        }
                    }

                    if (user.getId()
                            .equals(image.getCreator()
                                    .getId())) {
                        statusObject.setErrorMessage("Pay failed because user is creator");
                        return statusObject;
                    }
                    Fee fee = feeRepository.findFeeByType(TransactionType.SALE);
                    if (fee == null) {
                        statusObject.setErrorMessage("Pay failed because fee not found");
                        return statusObject;
                    }
                    localPayment.setAmount(image.getPrice());
                    amount.setTotal(image.getPrice()
                            .setScale(2, RoundingMode.HALF_UP)
                            .toString());
                }
                case SUBSCRIBE -> {
                    if (createPaymentRequest.getReferenceId() == null || createPaymentRequest.getReferenceId()
                            .isEmpty()) {
                        statusObject.setErrorMessage("Reference ID must be required in this type");
                        return statusObject;
                    }
                    SubscriptionPlan plan = planRepository
                            .findById(UUID.fromString(createPaymentRequest.getReferenceId()))
                            .orElse(null);
                    if (plan == null) {
                        statusObject.setErrorMessage("Pay failed because plan not found");
                        return statusObject;
                    }
                    localPayment.setAmount(plan.getPrice());
                    // Format số tiền (BigDecimal -> String 2 số thập phân)
                    amount.setTotal(
                            plan.getPrice()
                                    .setScale(2, RoundingMode.HALF_UP)
                                    .toString());
                }
                case DEPOSIT -> {
                    BigDecimal min = BigDecimal.valueOf(100);
                    if (createPaymentRequest.getAmount() == null) {
                        statusObject.setErrorMessage("Amount is required in this type");
                        return statusObject;
                    }
                    if (createPaymentRequest.getAmount()
                            .compareTo(min) < 0) {
                        statusObject.setErrorMessage("Amount must be greater or equals " + min + "$");
                        return statusObject;
                    }
                    Fee fee = feeRepository.findFeeByType(TransactionType.DEPOSIT);
                    if (fee == null) {
                        statusObject.setErrorMessage("Pay failed because fee not found");
                        return statusObject;
                    }
                    localPayment.setAmount(createPaymentRequest.getAmount());
                    amount.setTotal(createPaymentRequest.getAmount()
                            .setScale(2, RoundingMode.HALF_UP)
                            .toString());
                }

                default -> {
                    statusObject.setErrorMessage("This transaction type does not exist or coming soon");
                    statusObject.setSuccess(false);
                    return statusObject;
                }
            }

            // Local payment
            localPayment.setId(UuidCreator.getTimeOrderedEpoch());
            localPayment.setUser(user);
            localPayment.setCurrency("USD");
            localPayment.setGateway(PaymentGateway.PAYPAL.getId());
            localPayment.setStatus(PaymentStatus.PENDING.getId());
            localPayment.setType(createPaymentRequest.getType());
            localPayment.setReferenceId(createPaymentRequest.getReferenceId() == null ? localPayment.getId().toString()
                    : createPaymentRequest.getReferenceId());
            localPayment.setCreatedDate(LocalDateTime.now());

            paymentRepository.save(localPayment);

            Transaction transaction = new Transaction();
            transaction.setDescription("Payment for plan: ");
            transaction.setAmount(amount);

            List<Transaction> transactions = new ArrayList<>();
            transactions.add(transaction);

            Payer payer = new Payer();
            payer.setPaymentMethod("paypal");

            com.paypal.api.payments.Payment payPalRequest = new com.paypal.api.payments.Payment();
            payPalRequest.setIntent("sale");
            payPalRequest.setPayer(payer);
            payPalRequest.setTransactions(transactions);

            RedirectUrls redirectUrls = new RedirectUrls();
            String finalCancelUrl = UriComponentsBuilder.fromUriString(checkPaymentUrl)
                    .queryParam("localPaymentId", localPayment.getId())
                    .queryParam("status", "false")
                    .queryParam("referenceId", localPayment.getReferenceId())
                    .queryParam("type", createPaymentRequest.getType())
                    .build()
                    .toUriString();

            String finalSuccessUrl = UriComponentsBuilder.fromUriString(checkPaymentUrl)
                    .queryParam("localPaymentId", localPayment.getId())
                    .queryParam("status", "true")
                    .queryParam("referenceId", localPayment.getReferenceId())
                    .queryParam("type", createPaymentRequest.getType())
                    .build()
                    .toUriString();

            redirectUrls.setCancelUrl(finalCancelUrl);
            redirectUrls.setReturnUrl(finalSuccessUrl);
            payPalRequest.setRedirectUrls(redirectUrls);

            // 4. Gửi request lên PayPal
            com.paypal.api.payments.Payment createdPayment = payPalRequest.create(apiContext);

            localPayment.setTransactionRefId(createdPayment.getId());
            paymentRepository.save(localPayment);

            // 6. Lấy Approval URL
            String approvalUrl = "";
            for (Links link : createdPayment.getLinks()) {
                if (link.getRel()
                        .equals("approval_url")) {
                    approvalUrl = link.getHref();
                    break;
                }
            }

            if (approvalUrl.isEmpty()) {
                statusObject.setErrorMessage("PayPal approval URL not found");
                return statusObject;
            }

            statusObject.setSuccess(true);
            statusObject.setMessage("Payment link created");
            statusObject.setData(approvalUrl);
            return statusObject;

        } catch (PayPalRESTException e) {
            statusObject.setErrorMessage("PayPal Error: " + e.getMessage());
            return statusObject;
        }
    }

    @Override
    @Transactional
    public Status executePayment(PaymentExecuteRequest paymentExecuteRequest) {
        Status status = new Status(false, "", "");
        try {
            Payment localPayment = paymentRepository
                    .findById(UUID.fromString(paymentExecuteRequest.getLocalPaymentId()))
                    .orElse((null));
            if (localPayment == null) {
                status.setErrorMessage("Local payment not found");
                return status;
            }
            if (localPayment.getStatus() == PaymentStatus.SUCCESS.getId()) {
                status.setErrorMessage("Payment already successful");
                return status;
            }
            if (localPayment.getStatus() == PaymentStatus.CANCELED.getId()) {
                status.setErrorMessage("Payment is canceled");
                return status;
            }

            com.paypal.api.payments.Payment payment = new com.paypal.api.payments.Payment();
            payment.setId(paymentExecuteRequest.getPaymentId());
            PaymentExecution paymentExecute = new PaymentExecution();
            paymentExecute.setPayerId(paymentExecuteRequest.getPayerId());

            com.paypal.api.payments.Payment executedPayment = payment.execute(apiContext, paymentExecute);

            if (localPayment.getTransactionRefId() == null) {
                localPayment.setTransactionRefId(paymentExecuteRequest.getPaymentId());
            }

            if ("approved".equals(executedPayment.getState())) {
                if (localPayment.getType() == TransactionType.SUBSCRIBE) {
                    handleSuccessPaymentForSubscribe(
                            localPayment,
                            payment,
                            paymentExecuteRequest.getReferenceId(),
                            status);
                } else if (localPayment.getType() == TransactionType.PURCHASE) {
                    handleSuccessPaymentForPurchase(
                            localPayment,
                            payment,
                            paymentExecuteRequest.getReferenceId(),
                            status);
                } else if (localPayment.getType() == TransactionType.DEPOSIT) {
                    handleSuccessPaymentForDeposit(
                            localPayment,
                            payment,
                            status);
                } else {
                    status.setErrorMessage("This type will be come soon, please choose another type");
                }
            } else {
                localPayment.setStatus(PaymentStatus.FAILED.getId());
                paymentRepository.save(localPayment);

                status.setErrorMessage("Payment not approved. State: " + executedPayment.getState());
            }

        } catch (PayPalRESTException e) {
            System.err.println("PayPal Execute Error: " + e.getMessage());
            // Kiểm tra lại trạng thái thực tế trên PayPal (Double Check)
            boolean recovered = checkAndRecoverPayment(
                    paymentExecuteRequest.getPaymentId(),
                    paymentExecuteRequest.getLocalPaymentId(),
                    paymentExecuteRequest.getReferenceId(),
                    status);

            if (!recovered) {
                // Nếu check lại mà vẫn không được hoặc lỗi thật sự -> Mới set FAILED
                Payment localPayment = paymentRepository
                        .findById(UUID.fromString(paymentExecuteRequest.getLocalPaymentId()))
                        .orElse(null);
                if (localPayment != null) {
                    localPayment.setStatus(PaymentStatus.FAILED.getId());
                    paymentRepository.save(localPayment);
                }
                status.setErrorMessage("PayPal Error: " + e.getMessage());
            }
        } catch (IndexOutOfBoundsException e) {
            e.printStackTrace();
        }

        return status;
    }

    @Transactional
    public boolean checkAndRecoverPayment(
            String paypalPaymentId,
            String localPaymentId,
            String referenceId,
            Status status) {
        try {
            // Gọi lên PayPal lấy thông tin Payment
            com.paypal.api.payments.Payment checkedPayment = com.paypal.api.payments.Payment.get(
                    apiContext,
                    paypalPaymentId);

            if ("approved".equals(checkedPayment.getState())) {
                // Tiền đã trừ rồi, dù bị Exception
                Payment localPayment = paymentRepository.findById(UUID.fromString(localPaymentId))
                        .orElse(null);
                if (localPayment != null) {
                    if (localPayment.getType() == TransactionType.SUBSCRIBE) {
                        handleSuccessPaymentForSubscribe(localPayment, checkedPayment, referenceId, status);
                    } else if (localPayment.getType() == TransactionType.PURCHASE) {
                        handleSuccessPaymentForPurchase(localPayment, checkedPayment, referenceId, status);
                    } else {
                        status.setErrorMessage("This type will be come soon, please choose another type");
                        return false;
                    }
                    status.setMessage("Payment successful (Recovered from error)");
                    return true;
                }
            }
        } catch (PayPalRESTException ex) {
            System.err.println("Recovery failed: " + ex.getMessage());
        }
        return false;
    }

    public void handleSuccessPaymentForSubscribe(
            Payment localPayment,
            com.paypal.api.payments.Payment paypalPaymentObject,
            String referenceId,
            Status status) {
        if (localPayment.getStatus() == PaymentStatus.SUCCESS.getId()) {
            status.setIsSuccess(true);
            status.setMessage("Payment already processed");
            return;
        }
        localPayment.setStatus(PaymentStatus.SUCCESS.getId());
        localPayment.setTransactionRefId(paypalPaymentObject.getId());
        boolean isSuccess = true;
        SubscriptionPlan plan = planRepository.findById(UUID.fromString(referenceId))
                .orElse(null);
        if (plan != null) {
            User buyer = localPayment.getUser();
            Status createUserSubscriptionStatus = userSubscriptionService.createUserSubscription(
                    buyer,
                    plan.getId()
                            .toString());
            if (createUserSubscriptionStatus.isSuccess()) {
                Wallet walletOfBuyer = walletRepository.findWalletByUserId(buyer.getId());
                if (walletOfBuyer == null) {
                    walletService.createDefaultWallet(buyer);
                    walletOfBuyer = walletRepository.findWalletByUserId(buyer.getId());
                }
                WalletTransaction walletTransactionOfBuyer = new WalletTransaction();
                walletTransactionOfBuyer.setWallet(walletOfBuyer);
                walletTransactionOfBuyer.setPayment(localPayment);
                walletTransactionOfBuyer.setType(TransactionType.SUBSCRIBE);
                walletTransactionOfBuyer.setFeeAmount(BigDecimal.ZERO);
                walletTransactionOfBuyer.setFeePercent(BigDecimal.ZERO);
                walletTransactionOfBuyer.setAmount(plan.getPrice()
                        .negate());
                walletTransactionOfBuyer
                        .setDescription("User renew " + plan.getDurationDays() + " days with " + plan.getPrice() + "$");
                walletTransactionOfBuyer.setReferenceId(plan.getId());
                walletTransactionOfBuyer.setBalanceAfter(walletOfBuyer.getBalance());
                walletTransactionOfBuyer.setNetReceivedAmount(BigDecimal.ZERO);
                walletTransactionRepository.save(walletTransactionOfBuyer);
            } else {
                isSuccess = false;
            }
        }
        paymentRepository.save(localPayment);
        status.setIsSuccess(isSuccess);
        status.setMessage(isSuccess ? "Payment successful"
                : "Payment successful but create transaction was failed. Please cap the announcement and contact us ");
    }

    @Transactional
    public void handleSuccessPaymentForPurchase(
            Payment localPayment,
            com.paypal.api.payments.Payment paypalPaymentObject,
            String referenceId,
            Status status) {
        if (localPayment.getStatus() == PaymentStatus.SUCCESS.getId()) {
            status.setIsSuccess(true);
            status.setMessage("Payment already processed");
            return;
        }
        localPayment.setStatus(PaymentStatus.SUCCESS.getId());
        localPayment.setTransactionRefId(paypalPaymentObject.getId());

        Image image = imageRepository.findImageById(UUID.fromString(referenceId));
        if (image == null) {
            image = imageRepository.findById(UUID.fromString(referenceId))
                    .orElse(null);
            if (image == null) {
                System.out.println("WARNING: Processing payment for DELETED image: " + referenceId);
            }
        }
        BigDecimal priceOfImage = image == null ? localPayment.getAmount() : image.getPrice();
        if (localPayment.getAmount()
                .compareTo(priceOfImage) != 0) {
            status.setIsSuccess(false);
            status.setErrorMessage("Payment amount mismatch");
            return;
        }

        Fee fee = feeRepository.findFeeByType(TransactionType.SALE);
        BigDecimal feePercent = (fee != null) ? fee.getPercent() : BigDecimal.ZERO;
        if (fee == null) {
            // Log error to monitoring system (Sentry, Grafana, Console...)
            System.err.println("ALERT: Missing Fee Config for Payment " + localPayment.getId());
        }
        Wallet walletOfSeller = walletRepository.findWalletByUserId(image.getCreator()
                .getId());
        if (walletOfSeller == null) {
            walletService.createDefaultWallet(image.getCreator());
            walletOfSeller = walletRepository.findWalletByUserId(image.getCreator()
                    .getId());
        }

        BigDecimal feeDiscount = BigDecimal.ZERO;
        LocalDateTime expiredDay = userSubscriptionRepository.getExpiredDayOfUser(image.getCreator().getId(),
                LocalDateTime.now());
        if (expiredDay != null && expiredDay.isAfter(LocalDateTime.now())) {
            feeDiscount = feePercent.multiply(BigDecimal.valueOf(0.5)); // Giảm 50% phí cho người dùng có đăng ký
        }
        BigDecimal effectiveFeePercent = feePercent.subtract(feeDiscount);
        BigDecimal feeAmount = FileHelper.calculateFee(image.getPrice(), effectiveFeePercent);
        WalletTransaction walletTransactionOfSeller = new WalletTransaction();
        walletTransactionOfSeller.setWallet(walletOfSeller);
        walletTransactionOfSeller.setAmount(localPayment.getAmount());
        walletTransactionOfSeller.setDescription("Sell image with " + localPayment.getAmount() + "$");
        walletTransactionOfSeller.setFee(fee);
        walletTransactionOfSeller.setFeePercent(effectiveFeePercent);
        walletTransactionOfSeller.setReferenceId(UUID.fromString(referenceId));
        walletTransactionOfSeller.setType(TransactionType.SALE);
        walletTransactionOfSeller.setFeeAmount(feeAmount);
        walletTransactionOfSeller.setNetReceivedAmount(localPayment.getAmount()
                .subtract(feeAmount));

        BigDecimal currentBalanceOfSeller = walletOfSeller.getBalance();
        BigDecimal balanceAfterSell = currentBalanceOfSeller.add(walletTransactionOfSeller.getNetReceivedAmount());
        walletOfSeller.setBalance(balanceAfterSell);
        walletTransactionOfSeller.setBalanceAfter(balanceAfterSell);

        Wallet walletOfBuyer = walletRepository.findWalletByUserId(localPayment.getUser()
                .getId());
        if (walletOfBuyer == null) {
            walletService.createDefaultWallet(localPayment.getUser());
            walletOfBuyer = walletRepository.findWalletByUserId(localPayment.getUser()
                    .getId());
        }

        WalletTransaction walletTransactionOfBuyer = new WalletTransaction();
        walletTransactionOfBuyer.setWallet(walletOfBuyer);
        walletTransactionOfBuyer.setAmount(localPayment.getAmount()
                .negate());
        walletTransactionOfBuyer.setPayment(localPayment);
        walletTransactionOfBuyer.setDescription("Buy image with " + localPayment.getAmount() + "$");
        walletTransactionOfBuyer.setReferenceId(UUID.fromString(referenceId));
        walletTransactionOfBuyer.setType(TransactionType.PURCHASE);
        walletTransactionOfBuyer.setFeeAmount(BigDecimal.ZERO);
        walletTransactionOfBuyer.setFeePercent(BigDecimal.ZERO);
        walletTransactionOfBuyer.setNetReceivedAmount(BigDecimal.ZERO);
        walletTransactionOfBuyer.setBalanceAfter(walletOfBuyer.getBalance());


        walletRepository.save(walletOfSeller);
        walletRepository.save(walletOfBuyer);
        walletTransactionRepository.save(walletTransactionOfBuyer);
        walletTransactionRepository.save(walletTransactionOfSeller);

        UserPurchasedImage userPurchasedImage = new UserPurchasedImage();
        userPurchasedImage.setImage(image);
        userPurchasedImage.setUser(localPayment.getUser());
        userPurchasedImageRepository.save(userPurchasedImage);

        CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest();
        createNotificationRequest.setType(NotificationType.SALE_IMAGE);
        createNotificationRequest.setUserReceivingId(image.getCreator()
                .getId()
                .toString());
        createNotificationRequest.setReferenceId(referenceId);
        createNotificationRequest.setPayloadForSaleImage(
                new CreateNotificationRequest.PayloadForSaleImage(image.getId()
                        .toString()));

        StatusObject<Object> notification = notificationService.createNotification(
                createNotificationRequest,
                localPayment.getUser()
                        .getEmail());
        if (notification.isSuccess()) {
            System.out.println("Notification for sale image created successfully.");
        } else {
            System.out.println("Failed to create notification for sale image: " + notification.getErrorMessage());
        }
        paymentRepository.save(localPayment);
        status.setIsSuccess(true);
        status.setMessage("Payment successful");
    }

    public void handleSuccessPaymentForDeposit(
            Payment localPayment,
            com.paypal.api.payments.Payment paypalPaymentObject,
            Status status) {
        if (localPayment.getStatus() == PaymentStatus.SUCCESS.getId()) {
            status.setIsSuccess(true);
            status.setMessage("Payment already processed");
            return;
        }
        localPayment.setStatus(PaymentStatus.SUCCESS.getId());
        localPayment.setTransactionRefId(paypalPaymentObject.getId());
        StatusObject<WalletTransaction> walletTransactionStatus = walletTransactionService
                .getWalletTransactionAfterDeposit(
                        localPayment.getUser(),
                        localPayment.getAmount(),
                        localPayment.getId()
                                .toString());
        if (walletTransactionStatus.isSuccess() && walletTransactionStatus.getData() != null) {
            walletTransactionRepository.save(walletTransactionStatus.getData());
            status.setIsSuccess(true);
            status.setMessage("Payment successful");
        } else {
            status.setIsSuccess(true);
            status.setErrorMessage("Payment successful but " + walletTransactionStatus.getErrorMessage());
        }
        paymentRepository.save(localPayment);

    }

    @Override
    public Status cancelPayment(String localPaymentId) {
        Status status = new Status(false, "", "");
        try {
            Payment localPayment = paymentRepository.findById(UUID.fromString(localPaymentId))
                    .orElse((null));
            if (localPayment == null) {
                status.setErrorMessage("Local payment not found");
                return status;
            }
            localPayment.setStatus(PaymentStatus.CANCELED.getId());
            paymentRepository.save(localPayment);
            status.setIsSuccess(true);
            status.setMessage("Payment is canceled by customer");

            return status;
        } catch (Exception e) {
            status.setErrorMessage("System Error: " + e.getMessage());
            return status;
        }
    }

}