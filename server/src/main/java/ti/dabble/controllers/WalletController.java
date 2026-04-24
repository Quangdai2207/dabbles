package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.wallet.IWalletService;

@RestController
@RequestMapping("/api/wallet")
class WalletController {
    @Autowired
    private IWalletService walletService;

    @GetMapping(value = "/get-wallet-by-user")
    public ResponseEntity<StatusObject<WalletResponseDto>> getWalletByUser(Authentication authentication) {
        StatusObject<WalletResponseDto> statusObject = walletService.getWalletByUser(authentication.getName());
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }
}
