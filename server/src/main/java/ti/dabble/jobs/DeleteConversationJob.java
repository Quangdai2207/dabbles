package ti.dabble.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

import ti.dabble.entities.Conversation;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.repositories.ConversationParticipantRepository;
import ti.dabble.repositories.ConversationRepository;

@Component
public class DeleteConversationJob {
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private ConversationParticipantRepository participantRepository;

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void deleteConversation() {
        LocalDateTime cutOffTime = LocalDateTime.now()
                .minusMinutes(5);
        List<Conversation> conversations =
                conversationRepository.findConversationByLastMessageAtAndCreatedDateBefore(null, cutOffTime);
        try {
            if (conversations == null || conversations.isEmpty()) {
                return;
            }
            for (Conversation conversation : conversations) {
                List<ConversationParticipant> participants = conversation.getParticipants();
                participantRepository.deleteAll(participants);
                conversationRepository.delete(conversation);
            }
        }
        catch (Exception e) {
            e.getMessage();
        }
    }
}
