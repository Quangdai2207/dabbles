package ti.dabble.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.entities.keys.LikeImageKey;

@Entity
@Table(name = "like_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeImage {
    @Builder.Default
    @EmbeddedId
    private LikeImageKey id = new LikeImageKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("imageId")
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }
}