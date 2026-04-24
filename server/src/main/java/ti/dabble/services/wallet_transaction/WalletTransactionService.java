package ti.dabble.services.wallet_transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.f4b6a3.uuid.UuidCreator;

import ti.dabble.dtos.WalletTransactionAndPaginationDto;
import ti.dabble.dtos.WalletTransactionResponseDto;
import ti.dabble.entities.Fee;
import ti.dabble.entities.Image;
import ti.dabble.entities.Payment;
import ti.dabble.entities.SubscriptionPlan;
import ti.dabble.entities.User;
import ti.dabble.entities.UserPurchasedImage;
import ti.dabble.entities.Wallet;
import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.NotificationType;
import ti.dabble.enums.Role;
import ti.dabble.enums.TransactionType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.FeeRepository;
import ti.dabble.repositories.ImageRepository;
import ti.dabble.repositories.PaymentRepository;
import ti.dabble.repositories.SubscriptionPlanRepository;
import ti.dabble.repositories.UserPurchasedImageRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.repositories.WalletRepository;
import ti.dabble.repositories.WalletTransactionRepository;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.CreateWalletTransationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.query.QueryWalletTransactionRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;
import ti.dabble.services.user_subscription.IUserSubscriptionService;
import ti.dabble.services.wallet.WalletService;
import ti.dabble.specifications.WalletTransactionSpecification;

@Service
public class WalletTransactionService implements IWalletTransactionService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private FeeRepository feeRepository;
    @Autowired
    private IUserSubscriptionService userSubscriptionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private WalletService walletService;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserPurchasedImageRepository userPurchasedImageRepository;
    @Autowired
    private SubscriptionPlanRepository planRepository;
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @Transactional
    @Override
    public StatusObject<WalletTransactionResponseDto> createTransaction(
            CreateWalletTransationRequest request,
            String userEmail) {
        StatusObject<WalletTransactionResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        User buyer = userRepository.findByEmail(userEmail);
        if (buyer == null || buyer.getRoleId()
                .equalsIgnoreCase(String.valueOf(Role.ADMIN.getId())) || buyer.getRoleId()
                .equalsIgnoreCase(String.valueOf(Role.SUPERADMIN.getId()))) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }

        TransactionType typeOfRequest = request.getType();
        if (null != typeOfRequest) switch (typeOfRequest) {
            case WITHDRAWAL -> {
                if (request.getAmount() == null) {
                    statusObject.setErrorMessage("Amount is required for withdrawal");
                    return statusObject;
                }
                StatusObject<WalletTransaction> transactionAfterWithdrawStatus = getWalletTransactionAfterWithdrawal(
                        buyer,
                        request.getAmount());
                if (transactionAfterWithdrawStatus.isSuccess() && transactionAfterWithdrawStatus.getData() != null) {
                    walletTransactionRepository.save(transactionAfterWithdrawStatus.getData());
                    WalletTransactionResponseDto walletTransactionResponseDto = FileMapper.getWalletTransactionResponseDto(
                            transactionAfterWithdrawStatus.getData());
                    statusObject.setMessage(transactionAfterWithdrawStatus.getMessage());
                    statusObject.setData(walletTransactionResponseDto);
                    statusObject.setSuccess(true);
                    return statusObject;
                }
                statusObject.setErrorMessage(transactionAfterWithdrawStatus.getErrorMessage());
                return statusObject;
            }
            case SUBSCRIBE -> {
                if (request.getReferenceId() == null || request.getReferenceId().isEmpty()) {
                    statusObject.setErrorMessage("ReferenceId is required for subscribe");
                    return statusObject;
                }
                Status createUserSubStatus = userSubscriptionService.createUserSubscription(
                        buyer,
                        request.getReferenceId());
                if (createUserSubStatus.isSuccess()) {
                    StatusObject<WalletTransaction> transactionOfBuyerStatus = getWalletTransactionOfBuyer(
                            buyer,
                            request.getType(), request.getReferenceId());
                    if (transactionOfBuyerStatus.isSuccess() && transactionOfBuyerStatus.getData() != null) {
                        walletTransactionRepository.save(transactionOfBuyerStatus.getData());
                        WalletTransactionResponseDto walletTransactionResponseDto = FileMapper
                                .getWalletTransactionResponseDto(
                                        transactionOfBuyerStatus.getData());
                        statusObject.setSuccess(true);
                        statusObject.setMessage(transactionOfBuyerStatus.getMessage());
                        statusObject.setData(walletTransactionResponseDto);
                        return statusObject;
                    }
                    statusObject.setErrorMessage(transactionOfBuyerStatus.getErrorMessage());
                    return statusObject;
                }
                statusObject.setErrorMessage(createUserSubStatus.getErrorMessage());
                return statusObject;
            }
            case PURCHASE -> {
                if (request.getReferenceId() == null || request.getReferenceId().isEmpty()) {
                    statusObject.setErrorMessage("ReferenceId is required for purchase");
                    return statusObject;
                }
                Image image = imageRepository.findImageById(UUID.fromString(request.getReferenceId()));
                if (image == null) {
                    image = imageRepository.findById(UUID.fromString(request.getReferenceId()))
                            .orElse(null);
                    if (image == null) {
                        statusObject.setErrorMessage("Image does not exist or deleted");
                        return statusObject;
                    }
                }
                if (buyer.getId()
                        .equals(image.getCreator()
                                .getId())) {
                    statusObject.setErrorMessage("You can not buy your image");
                    return statusObject;
                }
                StatusObject<WalletTransaction> transactionOfBuyerStatus = getWalletTransactionOfBuyer(
                        buyer,
                        request.getType(), request.getReferenceId());
                if (!transactionOfBuyerStatus.isSuccess()) {
                    statusObject.setErrorMessage(transactionOfBuyerStatus.getErrorMessage());
                    return statusObject;
                }
                StatusObject<WalletTransaction> transactionOfSellerStatus = getWalletTransactionOfSeller(
                        image.getCreator(),
                        image);
                if (!transactionOfSellerStatus.isSuccess()) {
                    statusObject.setErrorMessage(transactionOfSellerStatus.getErrorMessage());
                    return statusObject;
                }
                if (transactionOfSellerStatus.getData() != null && transactionOfBuyerStatus.getData() != null) {
                    walletTransactionRepository.save(transactionOfBuyerStatus.getData());
                    walletTransactionRepository.save(transactionOfSellerStatus.getData());
                    WalletTransactionResponseDto walletTransactionResponseDto = FileMapper.getWalletTransactionResponseDto(
                            transactionOfBuyerStatus.getData());
                    UserPurchasedImage userPurchasedImage = new UserPurchasedImage();
                    userPurchasedImage.setImage(image);
                    userPurchasedImage.setUser(buyer);
                    userPurchasedImageRepository.save(userPurchasedImage);
                    
                    statusObject.setMessage("Buy image successfully");
                    statusObject.setSuccess(true);
                    statusObject.setData(walletTransactionResponseDto);
                    
                    CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest();
                    createNotificationRequest.setType(NotificationType.SALE_IMAGE);
                    createNotificationRequest.setUserReceivingId(image.getCreator()
                            .getId().toString());
                    createNotificationRequest.setReferenceId(image.getId().toString());
                    createNotificationRequest.setPayloadForSaleImage(
                            new CreateNotificationRequest.PayloadForSaleImage(image.getId().toString()));
                    
                    StatusObject<Object> notification = notificationService.createNotification(
                            createNotificationRequest,
                            buyer.getEmail());
                    if (!notification.isSuccess()) {
                        System.out
                                .println("Failed to create notification for sale image: " + notification.getErrorMessage());
                    }
                    return statusObject;
                }
                statusObject.setErrorMessage("Failed to buy image");
                return statusObject;
            }
            default -> {
            }
        }

        statusObject.setErrorMessage("The others type of transaction will come soon");
        return statusObject;
    }

    @Transactional
    @Override
    public StatusObject<WalletTransaction> getWalletTransactionOfBuyer(
            User buyer,
            TransactionType type,
            String referenceId) {

        StatusObject<WalletTransaction> statusObject = new StatusObject<>(false, "", "", null);

        Wallet walletOfBuyer = walletRepository.findWalletByUserId(buyer.getId());
        if (walletOfBuyer == null) {
            walletService.createDefaultWallet(buyer);
            walletOfBuyer = walletRepository.findWalletByUserId(buyer.getId());
        }
        WalletTransaction walletTransactionOfBuyer = new WalletTransaction();
        walletTransactionOfBuyer.setWallet(walletOfBuyer);

        if (type == TransactionType.PURCHASE) {
            Image image = imageRepository.findImageById(UUID.fromString(referenceId));
            if (walletOfBuyer.getBalance()
                    .compareTo(image.getPrice()) < 0) {
                statusObject.setErrorMessage("Your balance is not enough to buy");
                return statusObject;
            }
            boolean isBlocked = contactRepository.hasBlockedRelationship(buyer.getId(), image.getCreator().getId());
            if (isBlocked) {
                statusObject.setErrorMessage("Pay failed because you have blocked or been blocked by the creator");
                return statusObject;
            }
            boolean isPurchased = walletTransactionRepository.existByWalletIdAndTransactionTypeAndReferenceId(
                    walletOfBuyer.getId(),
                    TransactionType.PURCHASE,
                    image.getId());
            if (isPurchased) {
                statusObject.setErrorMessage("You have already bought this image");
                return statusObject;
            }

            walletTransactionOfBuyer.setType(TransactionType.PURCHASE);
            walletTransactionOfBuyer.setFeeAmount(BigDecimal.ZERO);
            walletTransactionOfBuyer.setAmount(image.getPrice()
                    .negate());
            walletTransactionOfBuyer.setDescription("Buy image with " + image.getPrice() + "$");
            walletTransactionOfBuyer.setReferenceId(image.getId());
            walletTransactionOfBuyer.setFeePercent(BigDecimal.ZERO);
            walletTransactionOfBuyer.setNetReceivedAmount(BigDecimal.ZERO);
            BigDecimal currentBalanceOfUser = walletOfBuyer.getBalance();
            walletOfBuyer.setBalance(currentBalanceOfUser.subtract(image.getPrice()));
            walletTransactionOfBuyer.setBalanceAfter(walletOfBuyer.getBalance());
            statusObject.setSuccess(true);
            statusObject.setMessage("Create wallet transaction of buyer successfully");
            statusObject.setData(walletTransactionOfBuyer);
        } else if (type == TransactionType.SUBSCRIBE) {
            SubscriptionPlan plan = planRepository.findPlanById(UUID.fromString(referenceId));
            if (plan == null) {
                statusObject.setErrorMessage("Plan not found");
                return statusObject;
            }
            walletTransactionOfBuyer.setType(TransactionType.SUBSCRIBE);
            walletTransactionOfBuyer.setFeeAmount(BigDecimal.ZERO);
            walletTransactionOfBuyer.setAmount(plan.getPrice()
                    .negate());
            walletTransactionOfBuyer
                    .setDescription("User renew " + plan.getDurationDays() + " days with " + plan.getPrice() + "$");
            walletTransactionOfBuyer.setReferenceId(plan.getId());
            walletTransactionOfBuyer.setNetReceivedAmount(BigDecimal.ZERO);
            walletTransactionOfBuyer.setFeePercent(BigDecimal.ZERO);
            walletTransactionOfBuyer.setBalanceAfter(walletOfBuyer.getBalance());
            BigDecimal currentBalanceOfUser = walletOfBuyer.getBalance();
            walletOfBuyer.setBalance(currentBalanceOfUser.subtract(plan.getPrice()));
            statusObject.setSuccess(true);
            statusObject.setMessage("Create wallet transaction of buyer successfully");
            statusObject.setData(walletTransactionOfBuyer);
        }
        walletRepository.save(walletOfBuyer);
        return statusObject;
    }

    @Transactional
    @Override
    public StatusObject<WalletTransaction> getWalletTransactionOfSeller(
            User seller,
            Image image) {
        StatusObject<WalletTransaction> statusObject = new StatusObject<>(false, "", "", null);
        Wallet walletOfSeller = walletRepository.findWalletByUserId(seller.getId());
        if (walletOfSeller == null) {
            walletService.createDefaultWallet(seller);
            walletOfSeller = walletRepository.findWalletByUserId(seller.getId());
        }
        Fee fee = feeRepository.findFeeByType(TransactionType.SALE);
        if (fee == null) {
            statusObject.setErrorMessage("Fee not found");
            return statusObject;
        }
        BigDecimal feeDiscount = BigDecimal.ZERO;
        LocalDateTime expiredDay = userSubscriptionRepository.getExpiredDayOfUser(image.getCreator().getId(),
                LocalDateTime.now());
        if (expiredDay != null && expiredDay.isAfter(LocalDateTime.now())) {
            feeDiscount = fee.getPercent().multiply(BigDecimal.valueOf(0.5)); // Giảm 50% phí cho người dùng có đăng ký
        }
        BigDecimal effectiveFeePercent = fee.getPercent().subtract(feeDiscount);
        BigDecimal feeAmount = FileHelper.calculateFee(image.getPrice(), effectiveFeePercent);
        WalletTransaction walletTransactionOfSeller = new WalletTransaction();
        walletTransactionOfSeller.setWallet(walletOfSeller);
        walletTransactionOfSeller.setType(TransactionType.SALE);
        walletTransactionOfSeller.setAmount(image.getPrice());
        walletTransactionOfSeller.setFee(fee);
        walletTransactionOfSeller.setFeePercent(effectiveFeePercent);
        walletTransactionOfSeller.setDescription("Sale image with " + image.getPrice() + "$");
        walletTransactionOfSeller.setFeeAmount(feeAmount);
        walletTransactionOfSeller.setReferenceId(image.getId());
        walletTransactionOfSeller.setNetReceivedAmount(image.getPrice()
                .subtract(feeAmount));
        BigDecimal currentBalanceOfUser = walletOfSeller.getBalance();
        walletOfSeller.setBalance(currentBalanceOfUser.add(walletTransactionOfSeller.getNetReceivedAmount()));
        walletTransactionOfSeller.setBalanceAfter(walletOfSeller.getBalance());
        walletRepository.save(walletOfSeller);

        statusObject.setSuccess(true);
        statusObject.setMessage("Create wallet transaction of seller successfully");
        statusObject.setData(walletTransactionOfSeller);
        return statusObject;
    }

    @Transactional
    @Override
    public StatusObject<WalletTransaction> getWalletTransactionAfterDeposit(
            User user,
            BigDecimal amount,
            String localPaymentId) {
        StatusObject<WalletTransaction> statusObject = new StatusObject<>(false, "", "", null);
        Wallet walletOfSeller = walletRepository.findWalletByUserId(user.getId());
        if (walletOfSeller == null) {
            walletService.createDefaultWallet(user);
            walletOfSeller = walletRepository.findWalletByUserId(user.getId());
        }
        Fee fee = feeRepository.findFeeByType(TransactionType.DEPOSIT);
        if (fee == null) {
            statusObject.setErrorMessage("Fee not found");
            return statusObject;
        }
        Payment localPayment = paymentRepository.findById(UUID.fromString(localPaymentId))
                .orElse(null);

        BigDecimal feeDiscount = BigDecimal.ZERO;
        LocalDateTime expiredDay = userSubscriptionRepository.getExpiredDayOfUser(user.getId(),
                LocalDateTime.now());
        if (expiredDay != null && expiredDay.isAfter(LocalDateTime.now())) {
            feeDiscount = fee.getPercent().multiply(BigDecimal.valueOf(0.5)); // Giảm 50% phí cho người dùng có đăng ký
        }
        BigDecimal effectiveFeePercent = fee.getPercent().subtract(feeDiscount);
        BigDecimal feeAmount = FileHelper.calculateFee(amount, effectiveFeePercent);
        WalletTransaction walletTransactionOfSeller = new WalletTransaction();
        walletTransactionOfSeller.setWallet(walletOfSeller);
        walletTransactionOfSeller.setPayment(localPayment);
        walletTransactionOfSeller.setType(TransactionType.DEPOSIT);
        walletTransactionOfSeller.setAmount(amount);
        walletTransactionOfSeller.setFee(fee);
        walletTransactionOfSeller.setFeePercent(effectiveFeePercent);
        walletTransactionOfSeller.setDescription("Deposit " + amount + "$ to your wallet");
        walletTransactionOfSeller.setFeeAmount(feeAmount);
        walletTransactionOfSeller.setReferenceId(UUID.fromString(localPaymentId));
        walletTransactionOfSeller.setNetReceivedAmount(amount.subtract(feeAmount));
        BigDecimal currentBalanceOfUser = walletOfSeller.getBalance();
        walletOfSeller.setBalance(currentBalanceOfUser.add(walletTransactionOfSeller.getNetReceivedAmount()));
        walletTransactionOfSeller.setBalanceAfter(walletOfSeller.getBalance());
        walletRepository.save(walletOfSeller);

        statusObject.setSuccess(true);
        statusObject.setMessage("Create wallet transaction of user successfully");
        statusObject.setData(walletTransactionOfSeller);
        return statusObject;
    }

    @Transactional
    @Override
    public StatusObject<WalletTransaction> getWalletTransactionAfterWithdrawal(
            User user,
            BigDecimal amount) {
        StatusObject<WalletTransaction> statusObject = new StatusObject<>(false, "", "", null);
        Wallet walletOfUser = walletRepository.findWalletByUserId(user.getId());
        if (walletOfUser == null) {
            walletService.createDefaultWallet(user);
            walletOfUser = walletRepository.findWalletByUserId(user.getId());
        }
        if (walletOfUser.getBalance().compareTo(amount) < 0) {
            statusObject.setErrorMessage("Your balance is not enough to withdraw");
            return statusObject;
        }
        if (amount.intValue() < 100) {
            statusObject.setErrorMessage("The minimum withdrawal amount is 100$");
            return statusObject;
        }
        Fee fee = feeRepository.findFeeByType(TransactionType.WITHDRAWAL);
        if (fee == null) {
            statusObject.setErrorMessage("Fee not found");
            return statusObject;
        }

        BigDecimal feeDiscount = BigDecimal.ZERO;
        LocalDateTime expiredDay = userSubscriptionRepository.getExpiredDayOfUser(user.getId(),
                LocalDateTime.now());
        if (expiredDay != null && expiredDay.isAfter(LocalDateTime.now())) {
            feeDiscount = fee.getPercent().multiply(BigDecimal.valueOf(0.5)); // Giảm 50% phí cho người dùng có đăng ký
        }
        BigDecimal effectiveFeePercent = fee.getPercent().subtract(feeDiscount);
        BigDecimal feeAmount = FileHelper.calculateFee(amount, effectiveFeePercent);
        WalletTransaction walletTransactionOfUser = new WalletTransaction();
        walletTransactionOfUser.setId(UuidCreator.getTimeOrderedEpoch());
        walletTransactionOfUser.setWallet(walletOfUser);
        walletTransactionOfUser.setType(TransactionType.WITHDRAWAL);
        walletTransactionOfUser.setAmount(amount.negate());
        walletTransactionOfUser.setFee(fee);
        walletTransactionOfUser.setFeePercent(effectiveFeePercent);
        walletTransactionOfUser.setDescription("Withdraw " + amount + "$ from your wallet");
        walletTransactionOfUser.setFeeAmount(feeAmount);
        walletTransactionOfUser.setReferenceId(walletTransactionOfUser.getId());
        walletTransactionOfUser.setNetReceivedAmount(amount.subtract(feeAmount));
        BigDecimal currentBalanceOfUser = walletOfUser.getBalance();
        walletOfUser.setBalance(currentBalanceOfUser.subtract(walletTransactionOfUser.getNetReceivedAmount()));
        walletTransactionOfUser.setBalanceAfter(walletOfUser.getBalance());
        walletRepository.save(walletOfUser);

        statusObject.setSuccess(true);
        statusObject.setMessage("Create wallet transaction of user successfully");
        statusObject.setData(walletTransactionOfUser);
        return statusObject;
    }

    @Override
    public StatusObject<WalletTransactionAndPaginationDto> searchWalletTransactionsByUser(
            QueryWalletTransactionRequest query,
            PaginationRequestForClient paginationRequest,
            String userEmail) {
        StatusObject<WalletTransactionAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Pageable pageable = buildPageable(query, paginationRequest);
            Page<WalletTransaction> walletTransactionPage = walletTransactionRepository.findAll(
                    WalletTransactionSpecification.filter(query, userEmail), pageable);
            List<WalletTransactionResponseDto> walletTransactionResponseDtos = walletTransactionPage.getContent()
                    .stream()
                    .map(
                            FileMapper::getWalletTransactionResponseDto)
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setData(new WalletTransactionAndPaginationDto(
                    walletTransactionPage.getTotalPages(),
                    walletTransactionResponseDtos));
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<WalletTransactionResponseDto> findWalletTransactionById(
            String id,
            String userEmail) {
        StatusObject<WalletTransactionResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            WalletTransaction walletTransaction = walletTransactionRepository.findById(UUID.fromString(id))
                    .orElse(null);
            if (walletTransaction == null) {
                statusObject.setMessage("No payment found");
            } else {
                User user = userRepository.findByEmail(userEmail);
                if (user == null) {
                    statusObject.setErrorMessage("User not found");
                    return statusObject;
                }
                if (!user.getId()
                        .equals(walletTransaction.getWallet()
                                .getUser()
                                .getId())) {
                    statusObject.setErrorMessage("You are not allowed to view this transaction");
                    return statusObject;
                }
                statusObject.setMessage("Get payments successfully");
                WalletTransactionResponseDto walletTransactionResponseDto = FileMapper
                        .getWalletTransactionResponseDto(walletTransaction);
                statusObject.setData(walletTransactionResponseDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    private Pageable buildPageable(
            QueryWalletTransactionRequest req,
            PaginationRequestForClient paginationRequest) {
        List<Sort.Order> orders = new ArrayList<>();

        // Dùng Boolean để check null (null nghĩa là user không quan tâm sort giá)
        if (req.getSortByPriceDesc() != null) {
            if (req.getSortByPriceDesc()) {
                orders.add(Sort.Order.desc("amount"));
            } else {
                orders.add(Sort.Order.asc("amount"));
            }
        }

        // 2. Sort theo CreatedDate (Mặc định hoặc theo yêu cầu)
        if (req.getSortByCreatedDateDesc() != null) {
            if (req.getSortByCreatedDateDesc()) {
                orders.add(Sort.Order.desc("id"));
            } else {
                orders.add(Sort.Order.asc("id"));
            }
        } else {
            if (orders.isEmpty()) {
                orders.add(Sort.Order.desc("id"));
            }
        }

        return PageRequest.of(
                paginationRequest.getPage(),
                15,
                Sort.by(orders));
    }
}
