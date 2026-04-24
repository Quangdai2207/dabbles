package ti.dabble.entities.keys;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ContactKey implements Serializable {

    @Column(name = "user_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID userId;

    @Column(name = "contact_user_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID contactUserId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContactKey that = (ContactKey) o;
        return java.util.Objects.equals(userId, that.userId) &&
                java.util.Objects.equals(contactUserId, that.contactUserId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId, contactUserId);
    }
}