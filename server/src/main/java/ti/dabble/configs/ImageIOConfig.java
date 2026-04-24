package ti.dabble.configs;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.imageio.ImageIO;

@Component
public class ImageIOConfig {

    @PostConstruct
    public void init() {
        ImageIO.scanForPlugins();
    }
}

