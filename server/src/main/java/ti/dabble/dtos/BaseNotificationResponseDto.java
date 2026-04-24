package ti.dabble.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.NotificationType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BaseNotificationResponseDto {
    private String id;
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime notificationCreatedDate;
}
