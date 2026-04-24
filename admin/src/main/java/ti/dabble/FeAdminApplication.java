package ti.dabble;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.redis.core.StringRedisTemplate;

@SpringBootApplication
public class FeAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeAdminApplication.class, args);
    }

}
