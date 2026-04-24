package ti.dabble.models.response;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocketLogin {
    String email;
    String role;
    String content;
}
