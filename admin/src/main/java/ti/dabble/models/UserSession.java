package ti.dabble.models;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSession {
    private String accountId;
    private String email;
    private String token;
    private long expires;
    private String browser;
}
