package ti.dabble.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConversationReadDto {
    private int totalUnreadConversations;
    private String conversationId;
    private String userId;
    LocalDateTime lastReadAt;
    boolean isRead;
}
