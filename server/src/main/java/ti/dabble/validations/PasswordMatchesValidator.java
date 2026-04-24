package ti.dabble.validations;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ti.dabble.annotations.PasswordMatches;


public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, PasswordConfirmationProvider> {

    @Override
    public boolean isValid(PasswordConfirmationProvider request, ConstraintValidatorContext context) {
        String password = request.getPassword();
        String passwordConfirm = request.getPasswordConfirm();

        if (password == null || passwordConfirm == null) {
            return true;
        }

        boolean isValid = password.equals(passwordConfirm);

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                    .addPropertyNode("passwordConfirm") // Gắn lỗi vào trường passwordConfirm
                    .addConstraintViolation();
        }

        return isValid;
    }
}
