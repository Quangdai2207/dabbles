package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ti.dabble.entities.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Wallet findWalletById(UUID id);

    Wallet findWalletByUserId(UUID userId);
}
