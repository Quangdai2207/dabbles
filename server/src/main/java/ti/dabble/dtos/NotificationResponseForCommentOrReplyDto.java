package ti.dabble.dtos;


import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseForCommentOrReplyDto extends BaseNotificationResponseDto {
    private CommentResponseDto comment;
}
