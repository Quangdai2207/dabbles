package ti.dabble.dtos;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseForLikeYourPostDto extends BaseNotificationResponseDto {
    private UserSummaryDto sender;
    private String imageId;
    private String image;
}
