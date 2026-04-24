package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import ti.dabble.dtos.WalletTransactionAndPaginationDto;
import ti.dabble.dtos.WalletTransactionResponseDto;
import ti.dabble.requests.CreateWalletTransationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.query.QueryWalletTransactionRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.wallet_transaction.IWalletTransactionService;

@RestController
@RequestMapping("/api/wallet-transaction")
class WalletTransactionController {
        @Autowired
        private IWalletTransactionService walletTransactionService;

        @PostMapping(value = "/create-transaction", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<StatusObject<WalletTransactionResponseDto>> createTransaction(
                        @Valid @RequestBody CreateWalletTransationRequest request,
                        Authentication authentication) {
                StatusObject<WalletTransactionResponseDto> statusObject = walletTransactionService
                                .createTransaction(request, authentication.getName());
                return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                                .body(statusObject);
        }

        @GetMapping(value = "/search-transactions-by-user", produces = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<StatusObject<WalletTransactionAndPaginationDto>> searchTransactions(
                        @ModelAttribute QueryWalletTransactionRequest query,
                        PaginationRequestForClient paginationRequest, Authentication authentication) {
                StatusObject<WalletTransactionAndPaginationDto> statusObject = walletTransactionService
                                .searchWalletTransactionsByUser(query, paginationRequest, authentication.getName());
                return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                                .body(statusObject);
        }

        @GetMapping(value = "/get-wallet-transaction-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<StatusObject<WalletTransactionResponseDto>> getWalletTransaction(@PathVariable("id") String id,
                        Authentication authentication) {
                StatusObject<WalletTransactionResponseDto> statusObject = walletTransactionService
                                .findWalletTransactionById(id, authentication.getName());
                return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                                .body(statusObject);
        }

}
