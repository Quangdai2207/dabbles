package ti.dabble.repositories;

import ti.dabble.entities.Conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query("SELECT c FROM Conversation c " +
            "JOIN ConversationParticipant p1 ON c.id = p1.conversation.id " +
            "JOIN ConversationParticipant p2 ON c.id = p2.conversation.id " +
            "WHERE c.type = 'PRIVATE' AND p1.user.id = :userId1 AND p2.user.id = :userId2")
    Optional<Conversation> findExistingPrivateConversation(@Param("userId1") UUID userId1,
                                                   @Param("userId2") UUID userId2);

    List<Conversation> findConversationByLastMessageAtAndCreatedDateBefore(LocalDateTime lastMessageAt, LocalDateTime createdAt);
    
}
