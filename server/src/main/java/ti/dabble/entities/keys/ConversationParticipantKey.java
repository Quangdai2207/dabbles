package ti.dabble.entities.keys;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.Objects;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ConversationParticipantKey implements Serializable {

    @Column(name = "conversation_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID conversationId;

    @Column(name = "user_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID userId;

    public void setConversationId(UUID conversationId) {
        this.conversationId = conversationId;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }
    // ------------------------------------------

    // Override equals và hashCode để đảm bảo composite key hoạt động đúng
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ConversationParticipantKey that = (ConversationParticipantKey) o;
        return Objects.equals(conversationId, that.conversationId) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(conversationId, userId);
    }
}