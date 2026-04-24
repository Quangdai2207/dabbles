package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(name = "content")
    private String content;

    @Column(name = "type")
    private String type;

    @Column(name = "reference_id")
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    private UUID referenceId;

    @Column(name = "child_reference_id")
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    private UUID childReferenceId;

    @Column(name = "is_read")
    private boolean isRead;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
             this.id = UuidCreator.getTimeOrderedEpoch(); 
        }
        this.createdDate = LocalDateTime.now();
        this.isRead = false;
    }
}