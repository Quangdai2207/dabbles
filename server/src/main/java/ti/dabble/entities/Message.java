package ti.dabble.entities;

import lombok.*;

import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.mapping.*;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import java.time.LocalDateTime;
import java.util.UUID;

@Table("messages") // Annotation của Cassandra
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    // --- KHÓA CHÍNH PHỨC HỢP ---

    @PrimaryKeyColumn(name = "conversation_id", ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private String conversationId;

    // Sắp xếp giảm dần theo thời gian (mới nhất lên đầu)
    @PrimaryKeyColumn(name = "created_date", ordinal = 1, type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
    private LocalDateTime createdDate;

    @PrimaryKeyColumn(name = "id", ordinal = 2, type = PrimaryKeyType.CLUSTERED)
    private String id;

    // --- CÁC CỘT DỮ LIỆU ---

    @Column("sender_id")
    private String senderId; // Chỉ lưu ID, không lưu Object User

    @Column("content")
    private String content;

    @Column("message_type")
    private String messageType;

    @Column("updated_date")
    private LocalDateTime updatedDate;

    @Column("is_deleted")
    private boolean isDeleted;

    // Giả lập @PrePersist (Cassandra không có sẵn, nên xử lý ở Service hoặc
    // Constructor)
    public void initDefault() {
        if (this.id == null)
            this.id = UUID.randomUUID().toString();
        if (this.createdDate == null)
            this.createdDate = LocalDateTime.now();
        if (this.messageType == null)
            this.messageType = "TEXT";
        this.isDeleted = false;
    }
}