package ti.dabble.jobs;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import ti.dabble.entities.Payment;
import ti.dabble.enums.PaymentStatus;
import ti.dabble.repositories.PaymentRepository;
import ti.dabble.response_status.Status;
import ti.dabble.services.paypal.PayPalService; // Hoặc IPayPalService
import com.paypal.base.rest.APIContext;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PaymentJob {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private APIContext apiContext;

    // Chạy mỗi 15 phút một lần
    @Scheduled(fixedRate = 15 * 60 * 1000)
    public void scanPendingOrders() {
        // Chỉ check những đơn đã tạo đc 10p
        LocalDateTime cutOffTime = LocalDateTime.now().minusMinutes(10);

        List<Payment> pendingPayments = paymentRepository.findAllByStatusAndCreatedDateBefore(
                PaymentStatus.PENDING.getId(),
                cutOffTime);

        for (Payment localPayment : pendingPayments) {
            if (localPayment.getTransactionRefId() == null)
                continue;

            try {
                // Check trong paypal xem tình trạng đơn hàng
                com.paypal.api.payments.Payment checkedPayment = com.paypal.api.payments.Payment.get(apiContext,
                        localPayment.getTransactionRefId());

                // nếu đã "approved" nhưng khách lại bị rớt mạng hoac tắt browser
                if ("approved".equalsIgnoreCase(checkedPayment.getState())) {

                    // thực hiện Execute tiền
                    com.paypal.api.payments.PaymentExecution execution = new com.paypal.api.payments.PaymentExecution();
                    execution.setPayerId(checkedPayment.getPayer().getPayerInfo().getPayerId());

                    try {
                        com.paypal.api.payments.Payment executedPayment = checkedPayment.execute(apiContext, execution);

                        if ("approved".equals(executedPayment.getState())) {
                            switch (localPayment.getType()) {
                                case SUBSCRIBE: {
                                    payPalService.handleSuccessPaymentForSubscribe(localPayment, executedPayment,
                                            localPayment.getReferenceId().toString(),
                                            new Status(true, "Recused the order successfully", ""));
                                    System.out
                                            .println("CronJob: Recused the order successfully " + localPayment.getId());
                                            break;
                                }
                                case PURCHASE: {
                                    payPalService.handleSuccessPaymentForPurchase(localPayment, executedPayment,
                                            localPayment.getReferenceId().toString(),
                                            new Status(true, "Recused the order successfully", ""));
                                    System.out
                                            .println("CronJob: Recused the order successfully " + localPayment.getId());
                                            break;
                                }
                                case DEPOSIT: {
                                    payPalService.handleSuccessPaymentForDeposit(localPayment, executedPayment,
                                            new Status(true, "Recused the order successfully", ""));
                                    System.out
                                            .println("CronJob: Recused the order successfully " + localPayment.getId());
                                            break;
                                }
                                default:
                                    break;
                            }
                          
                        }
                    } catch (Exception ex) {
                        System.err.println("CronJob Execute Failed: " + ex.getMessage());
                    }
                }
                // nếu đơn hàng pending quá lâu sau 1h người dùng chưa thanh toán thì canceled
                else if (localPayment.getCreatedDate().isBefore(LocalDateTime.now().minusHours(1))) {
                    localPayment.setStatus(PaymentStatus.CANCELED.getId());
                    paymentRepository.save(localPayment);
                }

            } catch (Exception e) {
                System.err.println("CronJob Error checking payment " + localPayment.getId() + ": " + e.getMessage());
            }
        }
    }
}