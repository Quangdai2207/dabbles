package ti.dabble.requests;

import ti.dabble.annotations.PasswordMatches;
import ti.dabble.validations.PasswordConfirmationProvider;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@PasswordMatches(message="Password does not match")
public class ChangePasswordRequest implements PasswordConfirmationProvider {
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String passwordConfirm;


}
