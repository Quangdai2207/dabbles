package ti.dabble.services.plan;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ti.dabble.entities.SubscriptionPlan;
import ti.dabble.repositories.SubscriptionPlanRepository;
import ti.dabble.requests.CreatePlanRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

@Service
public class PlanService implements IPlanService {
    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public StatusObject<SubscriptionPlan> createPlan(CreatePlanRequest request) {
        StatusObject<SubscriptionPlan> statusObject = new StatusObject<>(false, "", "", null);
        try {
            SubscriptionPlan newPlan = new SubscriptionPlan();
            newPlan.setPrice(request.getPrice());
            newPlan.setDurationDays(request.getDurationDays());
            newPlan.setDescription(request.getDescription());
            newPlan.setCreatedDate(LocalDateTime.now());
            subscriptionPlanRepository.save(newPlan);
            statusObject.setSuccess(true);
            statusObject.setMessage("Subscription plan created successfully.");
            statusObject.setData(newPlan);
            return statusObject;
        } catch (Exception e) {
            statusObject.setSuccess(false);
            statusObject.setErrorMessage("Failed to create subscription plan: " + e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<SubscriptionPlan> updatePlan(String id, CreatePlanRequest request) {
        StatusObject<SubscriptionPlan> statusObject = new StatusObject<>(false, "", "", null);
        try {
            SubscriptionPlan existingPlan = subscriptionPlanRepository.findPlanById(UUID.fromString(id));
            if (existingPlan == null) {
                statusObject.setSuccess(false);
                statusObject.setErrorMessage("Subscription plan not found.");
                return statusObject;
            }
            existingPlan.setId(UUID.fromString(id));
            existingPlan.setPrice(request.getPrice());
            existingPlan.setDurationDays(request.getDurationDays());
            existingPlan.setDescription(request.getDescription());
            existingPlan.setUpdatedDate(LocalDateTime.now());
            subscriptionPlanRepository.save(existingPlan);

            statusObject.setSuccess(true);
            statusObject.setMessage("Subscription plan updated successfully.");
            statusObject.setData(existingPlan);
            return statusObject;
        } catch (Exception e) {
            statusObject.setSuccess(false);
            statusObject.setErrorMessage("Failed to update subscription plan: " + e.getMessage());
            return statusObject;
        }
    }

    @Override
    public Status deletePlan(String id) {
        Status status = new Status(false, "", "");
        try {
            SubscriptionPlan existingPlan = subscriptionPlanRepository.findPlanById(UUID.fromString(id));
            if (existingPlan == null) {
                status.setErrorMessage("Subscription plan not found.");
                return status;
            }
            existingPlan.setDeleted(true);
            subscriptionPlanRepository.save(existingPlan);

            status.setIsSuccess(true);
            status.setMessage("Subscription plan deleted successfully.");
            return status;
        } catch (Exception e) {
            status.setErrorMessage("Failed to delete subscription plan: " + e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<SubscriptionPlan> getPlanById(String id) {
        StatusObject<SubscriptionPlan> statusObject = new StatusObject<>(false, "", "", null);
        try {
            SubscriptionPlan plan = subscriptionPlanRepository.findPlanById(UUID.fromString(id));
            if (plan == null) {
                statusObject.setErrorMessage("Subscription plan not found.");
                return statusObject;
            }
            statusObject.setSuccess(true);
            statusObject.setMessage("Subscription plan retrieved successfully.");
            statusObject.setData(plan);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage("Failed to retrieve subscription plan: " + e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<SubscriptionPlan>> getAllPlans() {
        StatusObject<List<SubscriptionPlan>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<SubscriptionPlan> plans = subscriptionPlanRepository.findAllPlans();
            if (plans.isEmpty()) {
                statusObject.setErrorMessage("No subscription plans found.");
                return statusObject;
            }
            statusObject.setSuccess(true);
            statusObject.setMessage("All subscription plans retrieved successfully.");
            statusObject.setData(plans);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage("Failed to retrieve all subscription plans: " + e.getMessage());
            return statusObject;
        }
    }
}