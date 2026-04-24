package ti.dabble.requests;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddParticipantToConversationRequest {
    @NotBlank(message = "Conversation ID is required")
    private String conversationId;

    @NotBlank(message = "Inviting user's email is required")
    private String userEmail;
}
