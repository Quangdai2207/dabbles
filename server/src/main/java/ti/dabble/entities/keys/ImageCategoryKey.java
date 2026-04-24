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
public class ImageCategoryKey implements Serializable {

    @Column(name = "image_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID imageId;

    @Column(name = "category_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID categoryId;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ImageCategoryKey that = (ImageCategoryKey) o;
        return java.util.Objects.equals(imageId, that.imageId) &&
                java.util.Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(imageId, categoryId);
    }
}