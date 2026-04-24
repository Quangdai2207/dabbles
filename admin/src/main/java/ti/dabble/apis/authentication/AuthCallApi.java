package ti.dabble.apis.authentication;

import retrofit2.http.Header;
import ti.dabble.models.request.auth.RequestLogin;
import ti.dabble.models.request.auth.ResetPassword;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

import java.util.Map;

public interface AuthCallApi {
    @POST(value = "/api/auth/login")
    Call<Map<String, Object>> login(@Header("X-Captcha-Token") String captchaToken, @Body RequestLogin login);

    @POST(value = "/auth/forgot-password")
    Call<String> forgot_password(@Body String email);

    @POST(value = "/auth/reset-password")
    Call<ResetPassword> resetPassword(@Body ResetPassword resetPassword);

    @POST(value = "/api/auth/logout")
    Call<Map<String, Object>> logout(@Header("Authorization") String authorization);
}
