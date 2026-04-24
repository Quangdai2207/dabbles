package ti.dabble.entities.keys;

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
public class BoardImageKey implements Serializable {

    @Column(name = "board_id")
    private String boardId;

    @Column(name = "image_id")
    private UUID imageId;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        BoardImageKey that = (BoardImageKey) o;
        return java.util.Objects.equals(boardId, that.boardId) &&
                java.util.Objects.equals(imageId, that.imageId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(boardId, imageId);
    }
}