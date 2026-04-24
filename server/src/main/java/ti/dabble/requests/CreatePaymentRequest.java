package ti.dabble.requests;

import java.math.BigDecimal;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.TransactionType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreatePaymentRequest {
    private BigDecimal amount;
    private String referenceId;
    @NotNull(message = "Type is required")
    @Schema(example = "SUBSCRIBE || PURCHASE || DEPOSIT")
    private TransactionType type;
}
