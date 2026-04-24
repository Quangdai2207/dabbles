package ti.dabble.models.response;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyToken {
    String id;
    String email;
    String role;
}
