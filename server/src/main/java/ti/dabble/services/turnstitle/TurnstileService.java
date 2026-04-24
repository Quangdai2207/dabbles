package ti.dabble.services.turnstitle;

import ti.dabble.services.redis.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Service
class TurnstileService implements ITurnstileService {

    @Autowired
    private RedisService redisService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${Turnstile_SecretKey}")
    private String secretKey;

    @Value("${Turnstile_ApiUrl}")
    private String apiUrl;

    @Override
    public boolean verifyToken(String token, String remoteIp) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        // BƯỚC 1: Kiểm tra xem token đã được sử dụng chưa
        if (redisService.exists(token)) {
            return false;
        }

        if (secretKey == null || apiUrl == null) {
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "secret=" + secretKey +
                    "&response=" + token +
                    "&remoteip=" + (remoteIp == null ? "127.0.0.1" : remoteIp);

            HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> result = response.getBody();

            if (result != null && Boolean.TRUE.equals(result.get("success"))) {
                redisService.set(token, "verify-human", Duration.ofMinutes(Long.parseLong("5")));
                return true;
            }
        } catch (Exception e) {
        }

        return false;
    }
}