package ti.dabble.dtos;

import lombok.AllArgsConstructor; // 1. Thêm cái này
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor; // 2. Thêm cái này
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {
    private String id;
    private String content;
    private String messageType;
    private LocalDateTime createdDate;
    private UserSummaryDto sender;
    private String conversationId;
}