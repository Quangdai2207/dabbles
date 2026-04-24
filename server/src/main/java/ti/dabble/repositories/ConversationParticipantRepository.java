package ti.dabble.repositories;

import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.keys.ConversationParticipantKey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, ConversationParticipantKey> {
    @Query("SELECT cp FROM ConversationParticipant cp JOIN cp.conversation c " +
            "WHERE cp.conversation.id = :conversationId " +
            "AND cp.isLeft = false " +
            "AND c.isDeleted = false")
    List<ConversationParticipant> findByConversationId(@Param("conversationId") UUID conversationId);
    
    @Query("SELECT cp FROM ConversationParticipant cp JOIN cp.conversation c " +
            "WHERE cp.conversation.id = :conversationId " +
            "AND cp.user.id = :userId " +
            "AND cp.isLeft = false " +
            "AND c.isDeleted = false")
    ConversationParticipant findByConversationIdAndUserId(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);
    
    @Query("SELECT cp FROM ConversationParticipant cp JOIN cp.conversation c " +
            "WHERE cp.user.id = :userId " +
            "AND cp.isLeft = false " +
            "AND c.isDeleted = false")
    List<ConversationParticipant> findByUserId(@Param("userId") UUID userId);    

    @Query("SELECT Count(cp) FROM ConversationParticipant cp JOIN cp.conversation c " +
            "WHERE cp.user.id = :userId " +
            "AND cp.isLeft = false " +
            "AND c.isDeleted = false " +
            "AND c.lastMessageAt IS NOT NULL " +
            "AND cp.lastReadAt < c.lastMessageAt " +
            "AND (cp.deletedMessageAt IS NULL OR cp.deletedMessageAt < c.lastMessageAt)"
    )
    long countUnreadConversations(@Param("userId") UUID userId);
}
