package ti.dabble.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseForAboutToExpiredSubscriptionDto extends BaseNotificationResponseDto{
    private String content;
}