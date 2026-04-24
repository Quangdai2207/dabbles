package ti.dabble.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.entities.keys.ImageCategoryKey;
import ti.dabble.entities.keys.UserPurchasedImageKey;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_purchased_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPurchasedImage {
    @EmbeddedId
    private UserPurchasedImageKey id = new UserPurchasedImageKey();
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