package ti.dabble.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.TransactionType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransactionResponseDto {
    private String id;
    private BigDecimal amount;
    private BigDecimal feeAmount;
    private BigDecimal feePercent;
    private BigDecimal netReceivedAmount;
    private BigDecimal balanceAfter;
    private String description;
    private TransactionType type;
    private LocalDateTime createdDate;
}
