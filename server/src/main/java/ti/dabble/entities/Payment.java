package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.*;
import lombok.*;
import ti.dabble.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "currency")
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", length = 60)
    private TransactionType type;

    @Column(name = "gateway") // 1:Paypal, 2:Stripe, 3:Momo, 4:VNPAY
    private int gateway;

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "transaction_ref_id")
    private String transactionRefId;

    @Column(name = "status") // 0:Failed, 1: Pending, 2:Success
    private int status;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
             this.id = UuidCreator.getTimeOrderedEpoch();
        }
        if(this.referenceId == null) {
            this.referenceId = this.id.toString();
        }
        this.createdDate = LocalDateTime.now();
        if (this.currency == null)
            this.currency = "USD";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}