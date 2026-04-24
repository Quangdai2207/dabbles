package ti.dabble.services.user_subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ti.dabble.dtos.*;
import ti.dabble.entities.SubscriptionPlan;
import ti.dabble.entities.User;
import ti.dabble.entities.UserSubscription;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.SubscriptionPlanRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.requests.PaginationRequest;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;
import ti.dabble.specifications.UserSubscriptionSpecification;

@Service
public class UserSubscriptionService implements IUserSubscriptionService {
    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    @Override
    public Status createUserSubscription(
            User buyer,
            String planId
    ) {
        Status status = new Status(false, "", "");
        SubscriptionPlan plan = planRepository.findPlanById(UUID.fromString(planId));
        if (plan != null) {
            UserSubscription oldUserSubscription = userSubscriptionRepository.findNewestByUserId(buyer.getId());
            UserSubscription newSub = new UserSubscription();
            newSub.setUser(buyer);
            newSub.setPlan(plan);
            newSub.setStatus(1);
            newSub.setPlanDurationDays(plan.getDurationDays());
            newSub.setPlanPrice(plan.getPrice());
            if (oldUserSubscription != null && oldUserSubscription.getEndDate()
                    .isAfter(LocalDateTime.now())) {
                newSub.setStartDate(oldUserSubscription.getEndDate());
                newSub.setEndDate(oldUserSubscription.getEndDate()
                                          .plusDays(plan.getDurationDays()));
            } else {
                newSub.setStartDate(LocalDateTime.now());
                newSub.setEndDate(LocalDateTime.now()
                                          .plusDays(plan.getDurationDays()));
            }

            userSubscriptionRepository.save(newSub);
            status.setIsSuccess(true);
            status.setMessage("Create user subscription successfully");
            return status;
        }
        status.setErrorMessage("Plan not found");
        return status;
    }

    @Override
    public StatusObject<List<UserSubscriptionResponseDto>> searchSubscriptionsByUser(
            QueryUserSubscriptionRequest query,
            PaginationRequest paginationRequest,
            String userEmail
    ) {
        StatusObject<List<UserSubscriptionResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Pageable pageable = buildPageable(query, paginationRequest.getPage(), paginationRequest.getSize());
            Page<UserSubscription> userSubscriptions = userSubscriptionRepository.findAll(
                    UserSubscriptionSpecification.filter(query, userEmail), pageable);
            List<UserSubscriptionResponseDto> userSubscriptionResponseDtos = userSubscriptions.getContent()
                    .stream()
                    .map(FileMapper::getUserSubscriptionResponseDto)
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get subscription of user successfully");
            statusObject.setData(userSubscriptionResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<ExpiredSubscriptionDayDto> getExpiredSubscriptionDay(String userEmail) {

        StatusObject<ExpiredSubscriptionDayDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            UserSubscription userSubscription = userSubscriptionRepository.findNewestByUserId(user.getId());
            if (userSubscription == null) {
                statusObject.setErrorMessage("User subscription not found");
                return statusObject;
            }
            if (userSubscription.getEndDate()
                    .isBefore(LocalDateTime.now())) {
                statusObject.setErrorMessage("User subscription is expired");
                return statusObject;

            }
            statusObject.setSuccess(true);
            statusObject.setMessage("Get expired subscription day successfully");
            statusObject.setData(new ExpiredSubscriptionDayDto(userSubscription.getEndDate()));
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }


    @Override
    public boolean updateStatus() {
        List<UserSubscription> expiredSubscriptions =
                userSubscriptionRepository.findExpiredSubscriptionByStatus(LocalDateTime.now());
        if (!expiredSubscriptions.isEmpty()) {
            for (UserSubscription expiredSubscription : expiredSubscriptions) {
                expiredSubscription.setStatus(2);
            }
            userSubscriptionRepository.saveAll(expiredSubscriptions);
            return true;
        }
        return false;
    }

    public Pageable buildPageable(
            QueryUserSubscriptionRequest req,
            int page,
            int size
    ) {

        Sort sort = Sort.unsorted();
        if (req.isSortByCreatedDateDesc()) {
            sort = sort.and(Sort.by(Sort.Direction.DESC, "createdDate"));
        }

        return PageRequest.of(page, size, sort);
    }
}
