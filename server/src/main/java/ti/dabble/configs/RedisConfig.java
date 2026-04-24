package ti.dabble.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;


@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        // Tạo một RedisTemplate
        RedisTemplate<String, Object> template = new RedisTemplate<>();

        // Thiết lập connection factory cho template
        template.setConnectionFactory(connectionFactory);

        // --- Cấu hình Serializer ---
        // 1. Key serializer: Sử dụng StringRedisSerializer để các key là chuỗi String, dễ đọc
        template.setKeySerializer(new StringRedisSerializer());

        // 2. Value serializer: Sử dụng GenericJackson2JsonRedisSerializer để các giá trị là JSON
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 3. Hash key serializer
        template.setHashKeySerializer(new StringRedisSerializer());

        // 4. Hash value serializer
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        // Kích hoạt các cài đặt
        template.afterPropertiesSet();

        return template;
    }

}
