package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.TransactionType;

@Repository
public interface WalletTransactionRepository
                extends JpaRepository<WalletTransaction, UUID>, JpaSpecificationExecutor<WalletTransaction> {
        WalletTransaction findWalletTransactionsById(UUID id);

        WalletTransaction findWalletTransactionsByWalletId(UUID userId);

        WalletTransaction findWalletTransactionByType(TransactionType type);

        List<WalletTransaction> findWalletTransactionByReferenceId(UUID referenceId);

        @Query("SELECT CASE WHEN COUNT(wt) > 0 THEN true ELSE false END FROM WalletTransaction wt WHERE wt.wallet.id = :walletId AND wt.type = :type AND wt.referenceId = :referenceId")
        boolean existByWalletIdAndTransactionTypeAndReferenceId(@Param("walletId") UUID walletId,
                        @Param("type") TransactionType type, @Param("referenceId") UUID referenceId);

        @Query("SELECT wt FROM WalletTransaction wt WHERE wt.wallet.user.id = :userId ORDER BY wt.createdDate DESC")
        List<WalletTransaction> findWalletTransactionByUser(@Param("userId") UUID userId);

        @Query("SELECT SUM(wt.netReceivedAmount) FROM WalletTransaction wt WHERE wt.wallet.user.id = :userId AND wt.type = 'SALE'")
        BigDecimal sumEarnedPointsByUserId(@Param("userId") UUID userId);

        @Query("SELECT SUM(wt.amount) FROM WalletTransaction wt WHERE wt.wallet.user.id = :userId AND (wt.type = 'PURCHASE' OR wt.type = 'SUBSCRIBE')")
        BigDecimal sumSpentPointsByUserId(@Param("userId") UUID userId);
}
