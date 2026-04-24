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
public class BoardResponseDto {
    private String id;
    private UserSummaryDto owner;
    private String name;
    private String description;
    private boolean isSecret;
    private String coverImageId;
    private boolean isDefault;
    private String slug;
    private LocalDateTime createdDate;
}
