package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import ti.dabble.dtos.BaseNotificationAndPaginationDto;
import ti.dabble.dtos.BaseNotificationResponseDto;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;

@RestController
@RequestMapping("/api/notification")
class NotificationController {
    @Autowired
    private INotificationService notificationService;

    @PutMapping(value = "mark-as-read-notification/{notificationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> markAsReadNotification(@PathVariable("notificationId") String notificationId, Authentication authentication) {
        Status status = notificationService.markAsRead(notificationId, authentication.getName());
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(status);
    }
    @PutMapping(value = "mark-as-read-all-notifications", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> markAsReadAllNotifications(Authentication authentication) {
        Status status = notificationService.markAsReadAll(authentication.getName());
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(status);
    }

    @GetMapping(value = "total-notification", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> totalNotification(Authentication authentication) {
        StatusObject<Integer> statusObject = notificationService.totalNotification(authentication.getName());
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "get-all-notification", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<BaseNotificationAndPaginationDto>> getAllNotification(Authentication authentication, @ModelAttribute PaginationRequestForClient paginationRequestForClient) {
        StatusObject<BaseNotificationAndPaginationDto> statusObject = notificationService.getAllNotification(authentication.getName(), paginationRequestForClient);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @DeleteMapping(value = "delete-notification/{notificationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteNotification(@PathVariable("notificationId") String notificationId, Authentication authentication) {
        Status status = notificationService.deleteNotification(authentication.getName(), notificationId);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(status);
    }
}
