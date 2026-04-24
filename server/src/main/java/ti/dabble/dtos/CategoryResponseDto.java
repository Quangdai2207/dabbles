package ti.dabble.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDto {
    private String id;
    private String name;
    private String slug;
    private String description;
    private boolean isFeatured;
}
