package ti.dabble.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletResponseForAdminDto {
    private UserSummaryDto user;
    private BigDecimal balance;
    private String currency;
}
