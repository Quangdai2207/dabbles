package ti.dabble.services.message;

import ti.dabble.dtos.MessageResponseDto;
import ti.dabble.requests.SendMessageRequest;
import ti.dabble.response_status.StatusObject;

import java.util.List;

public interface IMessageService {
    StatusObject<MessageResponseDto> sendMessage(SendMessageRequest sendMessageRequest, String senderId);
    StatusObject<List<MessageResponseDto>> messageOfConversation(String userEmail, String conversationId, String cursor);
}
