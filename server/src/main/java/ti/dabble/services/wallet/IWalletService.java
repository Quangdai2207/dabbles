package ti.dabble.services.wallet;

import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.entities.User;
import ti.dabble.response_status.StatusObject;

public interface IWalletService {
    void createDefaultWallet(User user);
    StatusObject<WalletResponseDto> getWalletByUser(String userEmail);
}
