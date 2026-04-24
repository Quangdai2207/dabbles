package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    // "PRIVATE", "GROUP"
    private String type;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    // Quan hệ để xóa Cascade: Xóa Conversation -> Xóa hết Participants
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConversationParticipant> participants;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
             this.id = UuidCreator.getTimeOrderedEpoch(); 
        };
        this.createdDate = LocalDateTime.now();
        this.isDeleted = false;
        if (this.type == null)
            this.type = "PRIVATE";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}