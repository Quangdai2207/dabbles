package ti.dabble.services.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import ti.dabble.apis.BaseUrl;
import ti.dabble.apis.authentication.AuthCallApi;
import ti.dabble.models.request.auth.RequestLogin;
import retrofit2.Response;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class AuthService implements IAuthService {
    private static final AuthCallApi authApi = BaseUrl.getClient().create(AuthCallApi.class);

    @Autowired
    private ObjectMapper mapper;

    @Override
    public Map<String, Object> login(String captchaToken, RequestLogin login) {
        Map<String, Object> response = new HashMap<>();
        try {
            Response<Map<String, Object>> res = authApi.login(captchaToken, login).execute();
            if (res.errorBody() != null) {
                response = mapper.readValue(res.errorBody().string(), Map.class);
            } else if (res.body() != null) {
                response = res.body();
            } else {
                response.put("isSuccess", false);
                response.put("errorMessage", "Response body is empty");
            }
        } catch (Exception ex) {
            System.out.print("Exception Service: " + ex);
            response.put("isSuccess", false);
            response.put("errorMessage", ex.getMessage());
        }
        return response;
    }

    @Override
    public Map<String, Object> logout(String authorization) {
        Map<String, Object> response = new HashMap<>();
        try {
            Response<Map<String, Object>> res = authApi.logout(authorization).execute();
            if (res.errorBody() != null) {
                response = mapper.readValue(res.errorBody().string(), Map.class);
            } else if (res.body() != null) {
                response = res.body();
            } else {
                response.put("isSuccess", false);
                response.put("errorMessage", "Response body is empty");
            }
        } catch (Exception ex) {
            System.out.print("Exception Service: " + ex);
            response.put("isSuccess", false);
            response.put("errorMessage", ex.getMessage());
        }
        return response;
    }
}
