package ti.dabble.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddImageToBoardRequest {
    @NotBlank(message = "Image is required")
    private UUID imageId;
    @NotBlank(message = "Board is required")
    private String boardId;
}
