package ti.dabble.requests;

import ti.dabble.annotations.MinimumAge;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class UpdateInfoUserRequest {
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

    private MultipartFile avatar;
    @NotNull(message = "Date of birth is required")
    @MinimumAge(value = 18, message = "You must be at least 18 years old")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @Schema(example = "dd/MM/yyyy")
    private LocalDate dateOfBirth;

}