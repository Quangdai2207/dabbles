package ti.dabble.jobs;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ti.dabble.entities.User;
import ti.dabble.entities.UserSubscription;
import ti.dabble.enums.NotificationType;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;

@Component
public class CheckExpiredSubscriptionJob {
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    @Autowired
    private INotificationService notificationService;

    // Cronjob impl at 8:00 AM
    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")
    public void scanExpiringSubscriptions() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeDaysLater = now.plusDays(3);

        List<UserSubscription> expiringSubs = userSubscriptionRepository
                .findLatestExpiringSubscriptionsPerUser(now, threeDaysLater);
        if (!expiringSubs.isEmpty()) {
            for (UserSubscription sub : expiringSubs) {
                User user = sub.getUser();
                int remainingDay = (int) ChronoUnit.DAYS.between(LocalDate.now(), sub.getEndDate().toLocalDate());
                System.out.println("AAA: " + user.getEmail());
                if (remainingDay <= 3) {
                    String content = remainingDay == 0 ? "Your subscription will be expired today"
                            : "Your subscription will be expired in " + remainingDay + " days";

                    CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
                    notificationRequest.setType(NotificationType.SUBSCRIPTION);
                    notificationRequest.setUserReceivingId(user.getId().toString());
                    notificationRequest.setPayloadForAboutToExpiredSubscription(
                            new CreateNotificationRequest.PayloadForAboutToExpiredSubscription(
                                    remainingDay,
                                    content));
                    StatusObject<Object> notificationStatus = notificationService.createNotification(
                            notificationRequest,
                            user.getEmail());
                    if (!notificationStatus.isSuccess()) {
                        System.out.println("Failed to send notification to user");
                    }
                }
            }
        }
    }

}
