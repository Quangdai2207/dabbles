package ti.dabble.models.request.auth;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPassword {
    private String password;
    private String passwordConfirm;
}
