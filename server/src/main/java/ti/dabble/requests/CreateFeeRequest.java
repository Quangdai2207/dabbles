package ti.dabble.requests;

import java.math.BigDecimal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class CreateFeeRequest {
    @Min(value = 0)
    @Max(value = 100)
    @NotNull(message = "Percent is required")
    private BigDecimal percent;
    @NotNull(message = "Type is required")
    private TransactionType type;
}
