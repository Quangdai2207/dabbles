package ti.dabble.services.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService implements IRedisService {

    private static final Logger logger = LoggerFactory.getLogger(RedisService.class);

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            logger.error("Error getting value from Redis for key: " + key, e);
            return null;
        }
    }

    @Override
    public <T> boolean set(String key, T value, Duration expiration) {
        try {
            redisTemplate.opsForValue().set(key, value, expiration);
            logger.info("Successfully set key: {} with value: {} and expiration: {}", key, value, expiration);
            return true;
        } catch (Exception e) {
            logger.error("Error setting value in Redis for key: " + key, e);
            return false;
        }
    }

    @Override
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            logger.info("Successfully deleted key: {}", key);
        } catch (Exception e) {
            logger.error("Error deleting key from Redis: " + key, e);
        }
    }

    @Override
    public boolean exists(String key) {
        try {
            // Boolean.TRUE.equals() là cách an toàn để xử lý trường hợp null
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            logger.error("Error checking if key exists in Redis: " + key, e);
            return false;
        }
    }
}