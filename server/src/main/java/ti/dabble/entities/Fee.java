package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.FeeType;
import ti.dabble.enums.TransactionType;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {
    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @Column(name = "percent", columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal percent;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TransactionType type;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

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