package ti.dabble.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentExecuteRequest {
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    @NotBlank(message = "Payer ID is required")
    private String payerId;
    @NotBlank(message = "Local payment ID is required")
    private String localPaymentId;
    @NotBlank(message = "Reference id is required")
    private String referenceId;
}
