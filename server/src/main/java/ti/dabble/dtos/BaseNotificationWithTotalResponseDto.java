package ti.dabble.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BaseNotificationWithTotalResponseDto {
    private int totalNotifications;
    private BaseNotificationResponseDto notification;
}
