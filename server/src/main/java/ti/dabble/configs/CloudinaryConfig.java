package ti.dabble.configs;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "drr9qndwx",
            "api_key", "624949777732477",
            "api_secret", "iGXKRLcbmnYOlE9vsDwG-F5ivKQ",
            "secure", true
        ));
    }
}