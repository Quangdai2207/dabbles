package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import ti.dabble.dtos.UserSubscriptionResponseDto;
import ti.dabble.requests.PaginationRequest;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.user_subscription.IUserSubscriptionService;

@RestController
@RequestMapping("/api/user-subscription")
class UserSubscriptionController {
    @Autowired
    private IUserSubscriptionService userSubscriptionService;

    @GetMapping(value = "search-subscriptions-by-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<UserSubscriptionResponseDto>>> searchSubscriptions(@ModelAttribute
                                                                                         QueryUserSubscriptionRequest query, PaginationRequest paginationRequest, Authentication authentication
                                                                                         ) {
        StatusObject<List<UserSubscriptionResponseDto>> statusObject = userSubscriptionService.searchSubscriptionsByUser(query, paginationRequest, authentication.getName());
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }
}
