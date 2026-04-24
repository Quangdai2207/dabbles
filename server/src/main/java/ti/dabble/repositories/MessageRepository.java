package ti.dabble.repositories;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Repository;
import ti.dabble.entities.Message;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends CassandraRepository<Message, String> {

    // 1. Lấy danh sách tin nhắn theo hội thoại (Mặc định đã sort DESC do thiết kế bảng)
    // Cassandra dùng Slice thay vì Page (vì không đếm được tổng số trang hiệu quả)
    Slice<Message> findByConversationId(String conversationId, Pageable pageable);

    // 2. Cursor Pagination: Lấy tin nhắn cũ hơn mốc thời gian (createdDate < cursor)
    // Query này cực nhanh trong Cassandra vì createdDate là Clustering Key
    @Query("SELECT * FROM messages WHERE conversation_id = ?0 AND created_date < ?1")
    Slice<Message> findMessageWithCursor(String conversationId, LocalDateTime cursor, Pageable pageable);

    // 3. Đếm tin nhắn mới (createdDate > date)
    @Query("SELECT COUNT(*) FROM messages WHERE conversation_id = ?0 AND created_date > ?1")
    long countByConversationIdAndCreatedDateAfter(String conversationId, LocalDateTime createdDate);

    @Query("SELECT * FROM messages WHERE conversation_id = ?0 AND created_date > ?1")
    List<Message> findMessageByConversationIdAndCreatedDateAfter(String conversationId, LocalDateTime createdDate);

    // 4. Lấy tin nhắn mới nhất
    // Limit 1 lấy bản ghi đầu tiên (do đã sort DESC ở level bảng)
    @Query("SELECT * FROM messages WHERE conversation_id = ?0 LIMIT 1")
    Message findTopByConversationId(String conversationId);

    // Case 3: created_date > deletedAt
    // Lưu ý: Dấu lớn hơn (>) cho trường hợp "tin nhắn sau khi xóa lịch sử"
    @Query("SELECT * FROM messages WHERE conversation_id = ?0 AND created_date > ?1")
    Slice<Message> findMessageByDeleted(String conversationId, LocalDateTime date, Pageable pageable);

    // Case 4: deletedAt < created_date < cursor
    @Query("SELECT * FROM messages WHERE conversation_id = ?0 AND created_date > ?1 AND created_date < ?2")
    Slice<Message> findMessageWithCursorAndDeleted(String conversationId, LocalDateTime date, LocalDateTime cursor, Pageable pageable);

}