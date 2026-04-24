package ti.dabble.requests;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.annotations.MinimumAge;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateInfoUserRequest {
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

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{9,15}$", message = "Phone number is not valid")
    private String phone;

    @NotNull(message = "Date of birth is required")
    @MinimumAge(value = 18, message = "You must be at least 18 years old")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Schema(example = "dd/MM/yyyy")
    private LocalDate dateOfBirth;
}
