package ti.dabble.requests;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.enums.NotificationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationRequest {
    @NotNull(message = "Type of request is required")
    @Schema(example = "FOLLOW_REQUEST || ACCEPTED")
    private NotificationType type;

    @NotBlank(message = "User who receives the request is required")
    private String userReceivingId;

    private String referenceId;

    private String childReferenceId;

    @Nullable
    private PayloadForLikeYourPost payloadForLikeYourPost;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayloadForLikeYourPost {
        private String imageId;
    }

    @Nullable
    private PayloadForCommentYourPost payloadForCommentYourPost;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayloadForCommentYourPost {
        private CommentResponseDto comment;
    }

    @Nullable
    private PayloadForSaleImage payloadForSaleImage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayloadForSaleImage {
        private String imageId;
    }

    @Nullable
    private PayloadForAboutToExpiredSubscription payloadForAboutToExpiredSubscription;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayloadForAboutToExpiredSubscription {
        private int remainingDay;
        private String content;
    }

}
