package ti.dabble.specifications;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import ti.dabble.entities.UserSubscription;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;

public class UserSubscriptionSpecification {
    public static Specification<UserSubscription> filter(
            QueryUserSubscriptionRequest req,
            String userEmail
    ) {
        return (
                Root<UserSubscription> root,
                CriteriaQuery<?> query,
                CriteriaBuilder cb
        ) -> {

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(
                    root.get("user")
                            .get("email"), userEmail
            ));
            // 🔹 filter by type
            if (req.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), req.getStatus().getId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
