package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "boards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "slug")
    private String slug;

    @Column(name = "is_secret")
    private boolean isSecret;

    @Column(name = "cover_image_id")
    private String coverImageId;

    @Column(name = "is_default")
    private boolean isDefault; // Board mặc định (Quick Save)

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
             this.id = UuidCreator.getTimeOrderedEpoch(); 
        };
        this.createdDate = LocalDateTime.now();
        this.isDeleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}