package ti.dabble.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFollowedCategoryDto {
    private UserSummaryDto user;
    private List<CategoryResponseDto> categories;
}
