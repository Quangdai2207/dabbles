package ti.dabble.dtos;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseForSaleImageDto extends BaseNotificationResponseDto {
    private UserSummaryDto sender;
    private String imageId;
    private String image;
}
