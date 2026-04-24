package ti.dabble.services.authentication;

import ti.dabble.models.request.auth.RequestLogin;

import java.util.Map;

public interface IAuthService {
    Map<String, Object> login(String captchaToken, RequestLogin login);
    Map<String, Object> logout(String authentication);
}
