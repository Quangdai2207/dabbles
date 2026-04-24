package ti.dabble;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

import jakarta.annotation.PostConstruct;

@EnableScheduling
@SpringBootApplication
public class DabbleApplication {
    public static void main(String[] args) {
        SpringApplication.run(DabbleApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

    }
}
