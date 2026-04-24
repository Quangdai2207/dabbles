package ti.dabble.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.BlockStatus;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponseForChatBoxDto {
    private String id;
    private String name;
    private String type;
    private String avatar;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadMessageCount;
    private List<UserSummaryDto> participants;
    private BlockStatus blockStatus;
    private LocalDateTime createdAt;
}
