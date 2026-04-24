package ti.dabble.controllers;

import ti.dabble.annotations.RateLimit;
import ti.dabble.requests.CreatePaymentRequest;
import ti.dabble.requests.PaymentExecuteRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.paypal.IPayPalService;
import jakarta.validation.Valid; // Import quan trọng
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paypal")
public class PayPalController {

    @Value("${check-payment_url}")
    private String checkPaymentUrl;

    @Autowired
    private IPayPalService paypalService;

    @RateLimit(limit = 5, window = 60)
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<String>> createPayment(
            @Valid @RequestBody CreatePaymentRequest createPaymentRequest,
            Authentication authentication
    ) {
        // Lấy planId từ request object
        StatusObject<String> statusObject = paypalService.createPaymentUrl(
                createPaymentRequest,
                authentication.getName(),
                checkPaymentUrl
        );

        if (statusObject.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @RateLimit(limit = 5, window = 60)
    @PostMapping(value = "/execute-payment", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> executePayment(
            @Valid @RequestBody
            PaymentExecuteRequest paymentExecuteRequest
            ) {
        Status status = paypalService.executePayment(paymentExecuteRequest);

        if (status.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }

    @DeleteMapping(value = "/cancel/{localPaymentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> cancelPayment(@PathVariable("localPaymentId") String localPaymentId) {
       Status status = paypalService.cancelPayment(localPaymentId);
       return ResponseEntity.status(HttpStatus.OK).body(status);
    }
}