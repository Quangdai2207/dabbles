package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import ti.dabble.entities.SubscriptionPlan;
import ti.dabble.requests.CreatePlanRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.plan.IPlanService;

@RestController
@RequestMapping("/api/plan")
class SubscriptionPlanController {
    @Autowired
    private IPlanService planService;

    @GetMapping(value = "get-plan-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<SubscriptionPlan>> getPlanById(@PathVariable("id") String id) {
        StatusObject<SubscriptionPlan> statusObject = planService.getPlanById(id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "get-all-plans", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<SubscriptionPlan>>> getAllPlans() {
        StatusObject<List<SubscriptionPlan>> statusObject = planService.getAllPlans();
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PostMapping(value = "create-plan", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<SubscriptionPlan>> createPlan(
            @Valid @RequestBody
            CreatePlanRequest request
    ) {
        StatusObject<SubscriptionPlan> statusObject = planService.createPlan(request);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PutMapping(value = "update-plan/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<SubscriptionPlan>> updatePlan(
            @PathVariable("id") String id,
            @Valid @RequestBody
            CreatePlanRequest request
    ) {
        StatusObject<SubscriptionPlan> statusObject = planService.updatePlan(id, request);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @DeleteMapping(value = "delete-plan/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deletePlan(
            @PathVariable("id") String id
    ) {
        Status status = planService.deletePlan(id);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }
}
