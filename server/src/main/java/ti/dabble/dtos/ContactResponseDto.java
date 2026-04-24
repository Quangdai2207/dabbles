package ti.dabble.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.ContactStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponseDto {
    private String userId;
    private String username;
    private String name;
    private String avatar;
    private ContactStatus followStatus;
}
