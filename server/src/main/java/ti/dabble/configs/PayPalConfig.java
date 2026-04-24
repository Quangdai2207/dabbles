package ti.dabble.configs;

import com.paypal.base.rest.APIContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PayPalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public APIContext apiContext() {
        // Cấu hình môi trường (sandbox hoặc live)
        Map<String, String> sdkConfig = new HashMap<>();
        sdkConfig.put("mode", mode);

        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            context.setConfigurationMap(sdkConfig);
            return context;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}