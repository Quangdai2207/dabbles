package ti.dabble.controllers.restAPIs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import ti.dabble.models.request.auth.RequestLogin;
import ti.dabble.services.authentication.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    /**
     * <div style="border: 1px solid #888; padding: 12px; color: #FFFFFF; font-family: 'tahoma'; background-color: #1e1e1e">
     *
     *     <h2 style="color: #4FC3F7; margin-bottom: 10px">
     *         AuthController – Login / Logout Session Management
     *     </h2>
     *
     *     <h4 style="color: #EEEE">Overview</h4>
     *     <p>
     *         The <b>AuthController</b> is responsible for handling user login
     *         and logout sessions when accessing the <b>admin BFF</b> application.
     *     </p>
     *
     *     <h4 style="color: white">Problem Context</h4>
     *     <p style="margin-left: 20px">
     *         In practice, the SPA application can fetch data directly from
     *         APIs provided by the core backend server <b>[dabble]</b>.
     *         However, the core backend authenticates requests using
     *         <b>tokens only</b> and does not use <code>HttpSession</code>
     *         to manage user access sessions.
     *     </p>
     *
     *     <p style="margin-left: 20px">
     *         Because of this limitation, the core backend cannot prevent
     *         a user from accessing the system simultaneously across
     *         multiple browsers.
     *     </p>
     *
     *     <h4 style="color: white">Solution</h4>
     *     <p style="margin-left: 20px">
     *         The <b>AuthController</b> is responsible for managing user
     *         access sessions within the admin BFF, ensuring controlled
     *         login behavior and preventing concurrent access from
     *         multiple browsers.
     *     </p>
     *
     *     <h4 style="color:  white">Design Decision</h4>
     *     <p style="margin-left: 20px">
     *         Although the core backend server <b>[dabble]</b> could manage
     *         sessions using <b>HttpSession</b> or <b>Redis</b>, this project
     *         simulates a scenario where the core backend does not fulfill
     *         the requirements of another service.
     *     </p>
     *
     *     <p style="margin-left: 20px">
     *         As a result, the <b>admin BFF</b> independently handles
     *         session management responsibilities.
     * <p>
     *         admin BFF maybe using HttpSession directly, but in this case, redis was selected
     *         because i wanna try it.
     *     </p>
     *
     *     <h4 style="color: white">Testing Focus</h4>
     *     <ol style="padding-left: 20px">
     *         <li>
     *             Install Redis locally for testing
     *             (<b>Redis used by admin BFF, not by server [dabble]</b>).
     *         </li>
     *         <li>
     *             Start Redis using
     *             <code>brew services start redis</code> or
     *             <code>redis-server</code>.
     *         </li>
     *         <li>
     *             Log in with the same account on two different browsers
     *             (e.g., Chrome and Safari) to verify session control logic.
     *             Microsoft Edge is not supported due to CAPTCHA token
     *             limitations.
     *         </li>
     *     </ol>
     *
     * </div>
     */

    @Autowired
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @PostMapping(
            value = "/login",
            consumes = MimeTypeUtils.APPLICATION_JSON_VALUE,
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE
    )
    public Object login(
            HttpServletRequest request,
            @RequestBody RequestLogin login
    ) throws JsonProcessingException {
        String captchaToken = request.getHeader("X-Captcha-Token");

        String redisKey = "login:" + login.getEmail();
        String redisRaw = stringRedisTemplate.opsForValue().get(redisKey);
        Map<String, Object> reject = new HashMap<>();

        if (redisRaw != null) {
            reject.put("isSuccess", false);
            reject.put("errorMessage", "User is already logged in on another device or browser!");
            return reject;
        }

        Map<String, Object> res = authService.login(captchaToken, login);

        if (!Boolean.TRUE.equals(res.get("isSuccess"))) {
            return res;
        }

        long expiresSeconds = ((Number) res.get("expires")).longValue();
        String jsonValue = objectMapper.writeValueAsString(res);
        stringRedisTemplate
                .opsForValue()
                .set(redisKey, jsonValue, expiresSeconds, TimeUnit.SECONDS);

        return res;
    }

    @PostMapping(
            value = "/logout",
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE
    )
    public Object logout(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        String email = request.getHeader("X-User-Email");

        //** Get response from origin server
        Map<String, Object> response = authService.logout(auth);

        //** If logout fail, return response with isSuccess false
        if (!Boolean.TRUE.equals(response.get("isSuccess"))) {
            return response;
        }

        //** IF ok, delete session oon redis BFF
        String key = "login:" + email;
        //** Clear User session within redis:
        stringRedisTemplate.delete(key);
        return response;
    }

//    @PostMapping(
//            value = "/logout",
//            produces = MimeTypeUtils.APPLICATION_JSON_VALUE
//    )
//    public Map<String, Object> logout(HttpServletRequest request) {
//        String email = request.getHeader("X-User-Email");
//
//        Map<String, Object> response = new HashMap<>();
//
//        if (email == null || email.isEmpty()) {
//            response.put("isSuccess", false);
//            response.put("errorMessage", "Not found email");
//            return response;
//        }
//
//        String key = "login:" + email;
//        Boolean exists = stringRedisTemplate.hasKey(key);
//
//        if (exists == null || !exists) {
//            response.put("isSuccess", false);
//            response.put("errorMessage", "This account is not logged in");
//            return response;
//        }
//
//        //** Clear User session within redis:
//        stringRedisTemplate.delete(key);
//
//        response.put("isSuccess", true);
//        response.put("message", "Logout successfully!");
//        return response;
//    }
}
