package ti.dabble.dtos;

import lombok.*;


@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseForAcceptOrFollowDto extends BaseNotificationResponseDto {
    private String content;
    private UserSummaryDto sender;
}