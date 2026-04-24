package ti.dabble.services.wallet_transaction;

import java.io.ObjectInputFilter.Status;
import java.math.BigDecimal;

import ti.dabble.dtos.WalletTransactionAndPaginationDto;
import ti.dabble.dtos.WalletTransactionResponseDto;
import ti.dabble.entities.Image;
import ti.dabble.entities.User;
import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.TransactionType;
import ti.dabble.requests.CreateWalletTransationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.query.QueryWalletTransactionRequest;
import ti.dabble.response_status.StatusObject;

public interface IWalletTransactionService {
    StatusObject<WalletTransactionResponseDto> createTransaction(
            CreateWalletTransationRequest request,
            String userEmail
    );

    StatusObject<WalletTransaction> getWalletTransactionOfSeller(
            User seller,
            Image image
    );
    StatusObject<WalletTransaction> getWalletTransactionOfBuyer(User buyer, TransactionType type, String referenceId);
    StatusObject<WalletTransaction> getWalletTransactionAfterDeposit(User user, BigDecimal amount, String localPaymentId);
    StatusObject<WalletTransaction> getWalletTransactionAfterWithdrawal(User user, BigDecimal amount);
    StatusObject<WalletTransactionResponseDto> findWalletTransactionById(String id, String userEmail);
    StatusObject<WalletTransactionAndPaginationDto> searchWalletTransactionsByUser(QueryWalletTransactionRequest query, PaginationRequestForClient paginationRequest, String userEmail);
}
