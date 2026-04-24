package ti.dabble.requests;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePlanRequest {
    @NotNull(message = "Price is required")
    @Min(1)
    private BigDecimal price;
    private String description;

    @Min(1)
    @NotNull(message = "Duration days is required")
    private int durationDays;
}
