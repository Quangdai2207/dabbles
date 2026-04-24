package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import ti.dabble.dtos.PaymentResponseDto;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.payment.IPaymentService;

@RestController
@RequestMapping("/api/payment")
class PaymentController {

    @Autowired
    private IPaymentService paymentService;


    @GetMapping(value = "/get-payments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<PaymentResponseDto>>> getAllPaymentByUser() {
        StatusObject<List<PaymentResponseDto>> statusObject = paymentService.findAllPayment();
        return ResponseEntity.status(HttpStatus.OK).body(statusObject);
    }

    @GetMapping(value = "/get-payments-by-user/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<PaymentResponseDto>>> getAllPaymentByUser(@PathVariable("username") String username) {
        StatusObject<List<PaymentResponseDto>> statusObject = paymentService.findAllPaymentByUsername(username);
        return ResponseEntity.status(HttpStatus.OK).body(statusObject);
    }

    @GetMapping(value = "/get-payments-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<PaymentResponseDto>> getPaymentById(@PathVariable("id") String id) {
        StatusObject<PaymentResponseDto> statusObject = paymentService.findPaymentById(id);
        return ResponseEntity.status(HttpStatus.OK).body(statusObject);
    }

    @GetMapping(value = "/get-payments-by-reference-id/{referenceId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<PaymentResponseDto>> getPaymentByReferenceId(@PathVariable("referenceId") String referenceId) {
        StatusObject<PaymentResponseDto> statusObject = paymentService.findPaymentByReferenceId(referenceId);
        return ResponseEntity.status(HttpStatus.OK).body(statusObject);
    }
}
