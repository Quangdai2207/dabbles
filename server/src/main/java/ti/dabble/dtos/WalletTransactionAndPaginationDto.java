package ti.dabble.dtos;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransactionAndPaginationDto {
    private int totalPage;
    private List<WalletTransactionResponseDto> walletTransactionResponseDtos;
}
