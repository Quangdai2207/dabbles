package ti.dabble.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.ContactStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileUserWithImageDto {
    private String id;
    private String username;
    private String name;
    private String avatar;
    private String bio;
    private int follower;
    private int following;
    private int totalLike;
    private int pendingRequestCount;
    private LocalDateTime expiredDay;
    private ContactStatus followStatus;
}
