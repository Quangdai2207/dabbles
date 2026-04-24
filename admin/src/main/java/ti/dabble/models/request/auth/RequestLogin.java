package ti.dabble.models.request.auth;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RequestLogin {
    private String email;
    private String password;
}
