package ti.dabble.dtos;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageResponseDto {
    private String id;
    private UserSummaryDto creator;
    private int width;
    private int height;
    private ImageUrl imageUrls;
    private List<CategoryResponseDto> categories;
    private int likeCount;
    private int commentCount;
    private boolean isLiked;
    private boolean isVisible;
    private boolean isDeleted;
    private BigDecimal price;
    private LocalDateTime createdDate;
}
