package ti.dabble.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileUserDto {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatar;
    private int warning;
    private boolean isPublic;
    private LocalDateTime expiredDay;
    private boolean isFollowedCategories;
    @Schema(example = "dd/MM/yyyy")
    private LocalDate dob;
}
