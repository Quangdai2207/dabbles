package ti.dabble.entities;

import jakarta.persistence.*;
import lombok.*;
import ti.dabble.entities.keys.BoardImageKey;

import java.time.LocalDateTime;

@Entity
@Table(name = "boards_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardImage {
    @Builder.Default
    @EmbeddedId
    private BoardImageKey id = new BoardImageKey();


    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("boardId")
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("imageId")
    @JoinColumn(name = "image_id")
    private Image image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_user_id")
    private User addedBy;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }
}