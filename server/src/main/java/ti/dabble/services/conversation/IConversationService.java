package ti.dabble.services.conversation;

import java.util.List;

import ti.dabble.dtos.BlockContactDto;
import ti.dabble.dtos.ConversationResponseDto;
import ti.dabble.dtos.ConversationResponseForChatBoxDto;
import ti.dabble.dtos.TotalOfUnreadConversationAndConversationResponseForChatBoxDto;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.User;
import ti.dabble.requests.AddParticipantToConversationRequest;
import ti.dabble.requests.CreateConversationRequest;
import ti.dabble.requests.RemoveUserFromConversationRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IConversationService {
    StatusObject<ConversationResponseDto> createConversation(String creatorEmail,
            CreateConversationRequest createConversationRequest);

    StatusObject<ConversationResponseDto> addParticipantToConversation(String adminEmail,
            AddParticipantToConversationRequest addParticipantToConversationRequest);

    StatusObject<List<ConversationResponseForChatBoxDto>> findAllConversationOfUser(String userEmail);

    StatusObject<Integer> getTotalOfUnreadConversation(String userEmail);

    Status markAsRead(String userEmail, String conversationId);

    Status deleteMessageHistoryOfConversation(String conversationId, String userEmail);

    Status leaveConversation(String userEmail, String conversationId);

    Status removeUserFromConversation(String userEmail,
            RemoveUserFromConversationRequest removeUserFromConversationRequest);

    StatusObject<ConversationResponseDto> findExistingPrivateConversation(String senderEmail, String otherUsername);

}
