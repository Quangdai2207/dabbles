package ti.dabble.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {
    @NotBlank(message = "Conversation ID is required")
    private String conversationId;

    @NotBlank(message = "Content cannot be empty")
    private String content;
}
