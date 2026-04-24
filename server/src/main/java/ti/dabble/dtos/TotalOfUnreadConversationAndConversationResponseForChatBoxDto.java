package ti.dabble.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TotalOfUnreadConversationAndConversationResponseForChatBoxDto {
    private int totalUnreadConversation;
    private ConversationResponseForChatBoxDto conversationResponseForChatBoxDto;
}
