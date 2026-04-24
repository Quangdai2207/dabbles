package ti.dabble.entities.keys;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class LikeImageKey implements Serializable {

    @Column(name = "user_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID userId;

    @Column(name = "image_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID imageId;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        LikeImageKey that = (LikeImageKey) o;
        return java.util.Objects.equals(userId, that.userId) &&
                java.util.Objects.equals(imageId, that.imageId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId, imageId);
    }
}