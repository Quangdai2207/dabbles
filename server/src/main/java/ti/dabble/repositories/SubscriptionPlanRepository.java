package ti.dabble.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ti.dabble.entities.SubscriptionPlan;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, UUID> {
    @Query("SELECT p FROM SubscriptionPlan p WHERE p.id = :id AND p.isDeleted = false")
    SubscriptionPlan findPlanById(@Param("id") UUID id);

    @Query("SELECT p FROM SubscriptionPlan p WHERE p.isDeleted = false")
    List<SubscriptionPlan> findAllPlans();

}
