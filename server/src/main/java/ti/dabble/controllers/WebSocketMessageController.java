package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import ti.dabble.dtos.MessageResponseDto;
import ti.dabble.requests.SendMessageRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.conversation.IConversationService;
import ti.dabble.services.message.IMessageService;
import ti.dabble.services.notification.INotificationService;

import java.security.Principal;
import java.util.Map;

@Controller
public class WebSocketMessageController {

    @Autowired
    private IMessageService messageService;
    @Autowired
    private IConversationService conversationService;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(
            @Payload SendMessageRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return;
        }

        String senderEmail = principal.getName();

        // 2. Gọi Service xử lý
        StatusObject<MessageResponseDto> result = messageService.sendMessage(request, senderEmail);

        // 3. Xử lý kết quả trả về
        if (!result.isSuccess()) {
            // /user/queue/errors
            sendErrorToUser(senderEmail, result.getErrorMessage());
        }
    }

    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload Map<String, String> payload, Principal principal) {
        if (principal == null) return;
        String senderEmail = principal.getName();
        String conversationId = payload.get("conversationId");

        // Gọi Service markAsRead
        conversationService.markAsRead(senderEmail, conversationId);
    }

    @MessageMapping("/chat.markAsReadNotification")
    public void markAsReadNotification(@Payload Map<String, String> payload, Principal principal) {
        if (principal == null) return;
        String authEmail = principal.getName();
        String notificationId = payload.get("notificationId");

        // Gọi Service markAsRead
        notificationService.markAsRead(notificationId, authEmail);
    }

    // NẾU THÀNH CÔNG:
    // Service đã tự động broadcast vào "/topic/conversation/{id}" rồi.
    // Controller không cần làm gì thêm, hoặc có thể gửi 1 tin nhắn "ACK" (xác nhận) nếu muốn.
    @MessageExceptionHandler
    public void handleException(
            Exception e,
            Principal principal
    ) {
        if (principal != null) {
            sendErrorToUser(principal.getName(), "System Error: " + e.getMessage());
        }
    }

    private void sendErrorToUser(
            String email,
            String errorMessage
    ) {
        StatusObject<String> errorResponse = new StatusObject<>();
        errorResponse.setSuccess(false);
        errorResponse.setErrorMessage(errorMessage);

        // Client lắng nghe tại: /user/queue/errors
        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/errors",
                errorResponse
        );
    }
}