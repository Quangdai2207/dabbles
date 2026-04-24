package ti.dabble.services.paypal;

import ti.dabble.requests.CreatePaymentRequest;
import ti.dabble.requests.PaymentExecuteRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IPayPalService {

    StatusObject<String> createPaymentUrl(
            CreatePaymentRequest createPaymentRequest,
            String userEmail,
            String checkPaymentUrl
    );

    Status executePayment(PaymentExecuteRequest paymentExecuteRequest);

    Status cancelPayment(String localPaymentId);
}
