package ti.dabble.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ti.dabble.services.user_subscription.IUserSubscriptionService;
@Component
public class UpdateSubscriptionStatusJob {
    @Autowired
    private IUserSubscriptionService userSubscriptionService;
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void UpdateSubscriptionStatus() {
        boolean isSuccess = userSubscriptionService.updateStatus();
        if(isSuccess) {
            System.out.println("Update status successfully");
        }
        else {
            System.out.println("Update status failed or nothing to update");
        }

    }
}
