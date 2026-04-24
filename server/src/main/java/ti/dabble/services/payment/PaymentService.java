package ti.dabble.services.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import ti.dabble.dtos.PaymentResponseDto;
import ti.dabble.dtos.UserSummaryForAdminDto;
import ti.dabble.entities.Payment;
import ti.dabble.entities.User;
import ti.dabble.repositories.PaymentRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.response_status.StatusObject;

@Service
public class PaymentService implements IPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public StatusObject<Integer> countPayments() {
        StatusObject<Integer> status = new StatusObject<>(false, "", "", 0);
        try {
            int countPayments = (int) paymentRepository.countPayments();
            status.setSuccess(true);
            status.setMessage(countPayments + " payments found");
            status.setData(countPayments);
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<List<PaymentResponseDto>> findAllPaymentByUsername(String username) {
        StatusObject<List<PaymentResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                statusObject.setMessage("No user found");
                return statusObject;
            }
            List<Payment> payments = paymentRepository.findAllByUserId(user.getId());
            if (payments.isEmpty()) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                List<PaymentResponseDto> paymentResponseDtos = payments.stream()
                        .map((payment) -> getPaymentResponseDto(payment, user))
                        .toList();
                statusObject.setData(paymentResponseDtos);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<PaymentResponseDto>> findAllPayment() {
        StatusObject<List<PaymentResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<Payment> payments = paymentRepository.findAll();
            if (payments.isEmpty()) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                List<PaymentResponseDto> paymentResponseDtos = payments.stream()
                        .map((payment) -> getPaymentResponseDto(payment, payment.getUser()))
                        .toList();
                statusObject.setData(paymentResponseDtos);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<PaymentResponseDto> findPaymentById(String id) {
        StatusObject<PaymentResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Payment payment = paymentRepository.findById(UUID.fromString(id))
                    .orElse(null);
            if (payment == null) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                PaymentResponseDto paymentResponseDto = getPaymentResponseDto(payment, payment.getUser());
                statusObject.setData(paymentResponseDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<PaymentResponseDto> findPaymentByReferenceId(String referenceId) {
        StatusObject<PaymentResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Payment payment = paymentRepository.findPaymentByReferenceId(referenceId);
            if (payment == null) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                PaymentResponseDto paymentResponseDto = getPaymentResponseDto(payment, payment.getUser());
                statusObject.setData(paymentResponseDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    private PaymentResponseDto getPaymentResponseDto(Payment payment, User user) {
        UserSummaryForAdminDto userDto = UserSummaryForAdminDto.builder()
                .id(user.getId().toString())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getFirstname() + " " + user.getLastname())
                .avatar(user.getAvatar())
                .build();
        return PaymentResponseDto.builder()
                .id(payment.getId().toString())
                .userDto(userDto)
                .referenceId(payment.getReferenceId().toString())
                .type(payment.getType())
                .amount(payment.getAmount())
                .paymentMethod(payment.getGateway())
                .paymentDate(payment.getCreatedDate())
                .paymentStatus(payment.getStatus())
                .currency(payment.getCurrency())
                .updateDate(payment.getUpdatedDate())
                .build();
    }
}
