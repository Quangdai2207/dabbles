package ti.dabble.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.ContactRequestType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUnfollowOrBlockOrUnblockUserRequest {
    @NotBlank(message = "User is required")
    private String username;
    @NotNull(message = "Type of this request is required")
    @Schema(example = "BLOCK || UNBLOCK || UNFOLLOW")
    private ContactRequestType typeOfRequest;
}
