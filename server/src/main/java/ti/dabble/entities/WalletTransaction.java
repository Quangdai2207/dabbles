package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import lombok.*;
import ti.dabble.enums.TransactionType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "wallet_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {
    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch(); // UUID

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @ManyToOne
    @JoinColumn(name = "fee_id")
    private Fee fee;

    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type")
    private TransactionType type; // DEPOSIT (Nạp), WITHDRAWAL (Rút), SALE (Bán ảnh), BUY (Mua ảnh)

    @Column(name = "amount", columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal amount; // Số tiền (+ hoặc -)
    @Column(name = "fee_percent")
    private BigDecimal feePercent;
    @Column(name = "fee_amount", columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal feeAmount; // Phí
    @Column(name = "net_received_amount", columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal netReceivedAmount; // Số tiền nhận

    @Column(name = "balance_after", columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal balanceAfter;

    @Column(name = "reference_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID referenceId; // ID đơn hàng (Order ID) hoặc ID PayPal transaction

    @Column(name = "description")
    private String description; // Ví dụ: "Sold image #123 to User ABC"

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UuidCreator.getTimeOrderedEpoch();
        }
        ;
        this.createdDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}