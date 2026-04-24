package ti.dabble.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageDetailsResponseDto {
    private String id;
    private ImageUrl imageUrls;
    private UserSummaryDto creator;
    private List<CategoryResponseDto> categories;
    private String description;
    private int likeCount;
    private int commentCount;
    private BigDecimal price;
    private boolean isLiked;
    private boolean isPurchased;
    private boolean isDeleted;
    private LocalDateTime createdDate;

}
