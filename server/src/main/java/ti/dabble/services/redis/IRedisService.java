package ti.dabble.services.redis;

import java.time.Duration;

public interface IRedisService {
    public Object get(String key);
    public <T> boolean set(String key, T value, Duration expiration);
    public void delete(String key);
    public boolean exists(String key);
}
