package ti.dabble.services.notification;


import ti.dabble.dtos.BaseNotificationAndPaginationDto;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface INotificationService {
    StatusObject<Object> createNotification(CreateNotificationRequest createNotificationRequest, String senderEmail);

    Status markAsRead(String notificationId, String userEmail);
    Status markAsReadAll(String userEmail);
    StatusObject<Integer> totalNotification(String userEmail);

    StatusObject<BaseNotificationAndPaginationDto> getAllNotification(String userEmail, PaginationRequestForClient paginationRequestForClient);

    Status deleteNotification(String userEmail, String notificationId);
}
