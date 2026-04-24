package ti.dabble.models.response;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private boolean isSuccess;
    private String message;
    private String errorMessage;
    private String token;
    private String accountId;
    private long expires;
    private String browser;
}



