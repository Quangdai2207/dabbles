package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import ti.dabble.annotations.RateLimit;
import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.enums.RateLimitKeyType;
import ti.dabble.requests.ForgotPasswordRequest;
import ti.dabble.requests.GoogleLoginRequest;
import ti.dabble.requests.LoginRequest;
import ti.dabble.requests.RegisterRequest;
import ti.dabble.requests.ResetPasswordRequest;
import ti.dabble.requests.TokenRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusAuth;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.auth.IAuthService;
import ti.dabble.services.turnstitle.ITurnstileService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private IAuthService authService;
    @Autowired
    private ITurnstileService turnstitleService;

    @RateLimit(limit = 60, window = 60, keyType = RateLimitKeyType.IP)
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusAuth> login(
            HttpServletRequest request,
            @Valid @RequestBody LoginRequest loginRequest) {
        StatusAuth statusAuth = new StatusAuth();
        statusAuth.setIsSuccess(false);
        statusAuth.setErrorMessage("");
        statusAuth.setMessage("");
        statusAuth.setAccountId(null);
        statusAuth.setExpires(0);
        statusAuth.setToken(null);

        String captchaToken = request.getHeader("X-Captcha-Token");

        if (captchaToken == null || captchaToken.isEmpty()) {
            statusAuth.setErrorMessage("CaptchaToken is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(statusAuth);
        }

        // Kiểm tra hợp lệ token Captcha
        String remoteIp = request.getRemoteAddr();
        boolean isCaptchaValid = turnstitleService.verifyToken(captchaToken, remoteIp);
        if (!isCaptchaValid) {
            statusAuth.setErrorMessage("CaptchaToken is not valid");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(statusAuth);
        }

        statusAuth = authService.login(loginRequest);

        return ResponseEntity.status(statusAuth.getIsSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
                .body(statusAuth);
    }

    @PostMapping("/logout")
    public ResponseEntity<Status> logout(HttpServletRequest request) {
        Status status = new Status(false, "", "");
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return ResponseEntity.status(HttpStatus.OK).body(authService.logout(token));
        } else {
            status.setErrorMessage("No token provided");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
        }

    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ProfileUserDto>> profile(Authentication authentication) {
        StatusObject<ProfileUserDto> status = authService.profile(authentication.getName());
        if (status.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(status);
    }

    @RateLimit(limit = 60, window = 60, keyType = RateLimitKeyType.IP)
    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ProfileUserDto>> register(HttpServletRequest request,
            @Valid @RequestBody RegisterRequest registerRequest) {
        StatusObject<ProfileUserDto> status = new StatusObject<>(false, "", "", null);

        String registerToken = request.getHeader("X-Register-Token");

        if (registerToken == null || registerToken.isEmpty()) {
        status.setErrorMessage("Register token is required");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(status);
        }

        // Kiểm tra hợp lệ token Captcha
        String remoteIp = request.getRemoteAddr();
        boolean isCaptchaValid = turnstitleService.verifyToken(registerToken,
        remoteIp);
        if (!isCaptchaValid) {
        status.setErrorMessage("Register is not valid");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(status);
        }
        status = authService.register(registerRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @RateLimit(limit = 60, window = 60, keyType = RateLimitKeyType.IP)
    @PostMapping(value = "/verify-account", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> verifyAccount(@Valid @RequestBody TokenRequest tokenRequest) {
        Status status = authService.verify(tokenRequest);

        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(value = "/reset-password", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        Status status = authService.resetPassword(resetPasswordRequest);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @RateLimit(limit = 60, window = 60, keyType = RateLimitKeyType.IP)
    @PostMapping(value = "/check-valid-token", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> isValidToken(@Valid @RequestBody TokenRequest tokenRequest) {
        Status status = authService.isValidToken(tokenRequest);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PostMapping(value = "/forgot-password", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        Status status = authService.forgotPassword(forgotPasswordRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @RateLimit(limit = 60, window = 60, keyType = RateLimitKeyType.IP)
    @PostMapping(value = "/google-login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusAuth> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        StatusAuth status = authService.loginWithGoogle(googleLoginRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(status);
    }
}
