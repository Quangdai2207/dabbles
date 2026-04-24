package ti.dabble.services.plan;

import java.util.List;

import ti.dabble.entities.SubscriptionPlan;
import ti.dabble.requests.CreatePlanRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IPlanService {
    StatusObject<SubscriptionPlan> createPlan(CreatePlanRequest request);
    StatusObject<SubscriptionPlan> updatePlan(String id, CreatePlanRequest request);
    Status deletePlan(String id);
    StatusObject<SubscriptionPlan> getPlanById(String id);
    StatusObject<List<SubscriptionPlan>> getAllPlans();
}
