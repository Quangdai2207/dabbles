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
public class ImageResponseForAdminDto {
    private String id;
    private UserSummaryForAdminDto creator;
    private int width;
    private int height;
    private long filesize;
    private String description;
    private ImageUrl imageUrls;
    private int likeCount;
    private int commentCount;
    private BigDecimal price;
    private boolean isPublic;
    private List<CategoryResponseDto> categories;
    private LocalDateTime createdDate;

}
