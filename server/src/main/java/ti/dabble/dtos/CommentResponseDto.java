package ti.dabble.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    private String id;
    private UserSummaryDto sender;
    private String content;
    private String parentId;
    private String imageId;
    private String imageUrl;
    private int like;
    private LocalDateTime createdDate;
}
