package ti.dabble.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RemoveUserFromConversationRequest {
    @NotBlank(message = "Target user is required")
    private String targetUserEmail;
    @NotBlank(message = "Conversation is required")
    private String conversationId;
}
