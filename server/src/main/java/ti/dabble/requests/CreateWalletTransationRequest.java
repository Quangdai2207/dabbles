package ti.dabble.requests;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.TransactionType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWalletTransationRequest {

    @NotNull(message = "Type is required")
    @Schema(example = "SUBSCRIBE || PURCHASE || WITHDRAWAL")
    private TransactionType type;
    private String referenceId;
    private BigDecimal amount;

}
