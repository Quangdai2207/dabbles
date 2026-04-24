package ti.dabble.services.payment;

import java.util.List;

import ti.dabble.dtos.PaymentResponseDto;
import ti.dabble.response_status.StatusObject;

public interface IPaymentService {
    StatusObject<List<PaymentResponseDto>> findAllPaymentByUsername(String username);

    StatusObject<List<PaymentResponseDto>> findAllPayment();

    StatusObject<PaymentResponseDto> findPaymentById(String id);

    StatusObject<PaymentResponseDto> findPaymentByReferenceId(String referenceId);

    StatusObject<Integer> countPayments();

}
