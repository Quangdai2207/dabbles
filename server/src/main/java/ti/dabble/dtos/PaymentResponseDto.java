package ti.dabble.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.TransactionType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {
    private String id;
    private UserSummaryForAdminDto userDto;
    private String referenceId;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private BigDecimal amount;
    private String currency;
    private int paymentMethod;
    private LocalDateTime paymentDate;
    private int paymentStatus;
    private LocalDateTime updateDate;
}
