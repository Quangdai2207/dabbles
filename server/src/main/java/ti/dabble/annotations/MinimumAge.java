package ti.dabble.annotations;

import ti.dabble.validations.MinimumAgeValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = MinimumAgeValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface MinimumAge {
    String message() default "User must be at least {value} years old.";
    int value(); // Giá trị tuổi tối thiểu
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
