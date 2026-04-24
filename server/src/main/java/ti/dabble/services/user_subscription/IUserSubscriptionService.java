package ti.dabble.services.user_subscription;

import java.util.List;

import ti.dabble.dtos.ExpiredSubscriptionDayDto;
import ti.dabble.dtos.UserSubscriptionResponseDto;
import ti.dabble.entities.User;
import ti.dabble.requests.PaginationRequest;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IUserSubscriptionService {
    Status createUserSubscription(User buyer, String planId);
    StatusObject<List<UserSubscriptionResponseDto>> searchSubscriptionsByUser(QueryUserSubscriptionRequest query, PaginationRequest paginationRequest, String userEmail);
    StatusObject<ExpiredSubscriptionDayDto> getExpiredSubscriptionDay(String userEmail);
    boolean updateStatus();
}
