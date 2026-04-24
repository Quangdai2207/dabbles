package ti.dabble.annotations;

import java.lang.annotation.*;

import ti.dabble.enums.RateLimitKeyType;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    int limit();          // số request
    int window();         // thời gian (giây)

    RateLimitKeyType keyType() default RateLimitKeyType.EMAIL;

}