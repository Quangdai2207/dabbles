package ti.dabble.requests.query;

import org.springframework.format.annotation.DateTimeFormat;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.TransactionGroup;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryWalletTransactionRequest {
    @Schema(example = "WALLET_FLOW / PURCHASE / SALE")
    @Enumerated(EnumType.STRING)
    private TransactionGroup group;
    private Boolean sortByPriceDesc;
    private Boolean sortByCreatedDateDesc;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

}
