package ti.dabble.requests;

import ti.dabble.annotations.MinimumAge;
import ti.dabble.annotations.PasswordMatches;
import ti.dabble.validations.PasswordConfirmationProvider;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateUserRequest implements PasswordConfirmationProvider {
    @NotBlank(message = "Username is required")
    @Pattern(
            regexp = "^[a-zA-Z0-9_]+$",
            message = "Username must not contain spaces or special characters"
    )
    private String username;
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email is not valid.")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{9,15}$", message = "Phone number is not valid")
    private String phone;

    @NotBlank(message = "Role is required")
    private String roleId;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String passwordConfirm;


    @NotNull(message = "Date of birth is required")
    @MinimumAge(value = 18, message = "You must be at least 18 years old")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Schema(example = "dd/MM/yyyy")
    private LocalDate dateOfBirth; // Thay thế 'long' bằng 'LocalDate'

}
