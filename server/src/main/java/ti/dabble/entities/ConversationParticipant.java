package ti.dabble.entities;

import jakarta.persistence.*;
import lombok.*;
import ti.dabble.entities.keys.ConversationParticipantKey;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_participants")
@Data
public class ConversationParticipant {

    @EmbeddedId
    private ConversationParticipantKey id = new ConversationParticipantKey();
    // --------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("conversationId")
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "role") // "ADMIN", "MEMBER"
    private String role;

    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    @Column(name="deleted_message_at")
    private LocalDateTime deletedMessageAt;

    @Column(name="is_left")
    private boolean isLeft;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
        this.lastReadAt = LocalDateTime.now();
        this.isLeft = false;
        this.deletedMessageAt = null;
        if (this.role == null) this.role = "MEMBER";
    }
}