package ti.dabble.services.wallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.entities.User;
import ti.dabble.entities.Wallet;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.WalletRepository;
import ti.dabble.repositories.WalletTransactionRepository;
import ti.dabble.response_status.StatusObject;

@Service
public class WalletService implements IWalletService {
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;
    @Override
    public void createDefaultWallet(User user) {
        Wallet defaultWallet = new Wallet();
        defaultWallet.setUser(user);
        defaultWallet.setBalance(BigDecimal.ZERO);
        defaultWallet.setCurrency("USD");
        walletRepository.save(defaultWallet);
    }

    @Override
    public StatusObject<WalletResponseDto> getWalletByUser(String userEmail) {
        StatusObject<WalletResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Wallet wallet = walletRepository.findWalletByUserId(user.getId());
            WalletResponseDto walletResponseDto = new WalletResponseDto();
            if (wallet != null) {
                walletResponseDto.setBalance(wallet.getBalance());
            }
            else {
                createDefaultWallet(user);
                walletResponseDto.setBalance(BigDecimal.ZERO);
            }
            walletResponseDto.setTotalEarned(
                    Optional.ofNullable(walletTransactionRepository.sumEarnedPointsByUserId(user.getId()))
                            .orElse(BigDecimal.ZERO)
                            .abs()
            );

            walletResponseDto.setTotalSpent(
                    Optional.ofNullable(walletTransactionRepository.sumSpentPointsByUserId(user.getId()))
                            .orElse(BigDecimal.ZERO)
                            .abs()
            );
            statusObject.setSuccess(true);
            statusObject.setMessage("Get wallet successfully");
            statusObject.setData(walletResponseDto);
            return statusObject;

        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }
}
