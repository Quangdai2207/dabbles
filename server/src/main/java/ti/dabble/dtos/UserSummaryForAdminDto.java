package ti.dabble.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryForAdminDto {
    private String id;
    private String username;
    private String email;
    private String name;
    private String avatar;
}
