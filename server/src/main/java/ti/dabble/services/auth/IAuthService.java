package ti.dabble.services.auth;

import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.requests.*;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusAuth;
import ti.dabble.response_status.StatusObject;

public interface IAuthService {
    StatusObject<ProfileUserDto> register(RegisterRequest registerRequest);

    StatusAuth login(LoginRequest loginRequest);

    StatusObject<ProfileUserDto> profile(String userEmail);

    Status verify(TokenRequest tokenRequest);

    Status forgotPassword(ForgotPasswordRequest forgotPasswordRequest);

    Status resetPassword(
            ResetPasswordRequest resetPasswordRequest
    );
    Status isValidToken(TokenRequest tokenRequest);

    StatusAuth loginWithGoogle(GoogleLoginRequest googleLoginRequest);
    Status logout(String token);
}