package ti.dabble.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.entities.keys.UserFollowedCategoryKey;

@Entity
@Table(name = "user_followed_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFollowedCategory {
    @Builder.Default
    @EmbeddedId
    private UserFollowedCategoryKey id = new UserFollowedCategoryKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }
}