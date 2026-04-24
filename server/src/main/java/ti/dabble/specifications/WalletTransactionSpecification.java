package ti.dabble.specifications;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;
import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.TransactionType;
import ti.dabble.requests.query.QueryWalletTransactionRequest;

public class WalletTransactionSpecification {

    public static Specification<WalletTransaction> filter(
            QueryWalletTransactionRequest req,
            String userEmail
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // filter theo user
            predicates.add(
                    cb.equal(
                            root.get("wallet")
                                .get("user")
                                .get("email"),
                            userEmail
                    )
            );

            // 🔹 filter theo GROUP
            if (req.getGroup() != null) {
                switch (req.getGroup()) {
                    case WALLET_FLOW -> predicates.add(
                            root.get("type").in(
                                    TransactionType.WITHDRAWAL,
                                    TransactionType.DEPOSIT,
                                    TransactionType.SUBSCRIBE
                            )
                    );

                    case PURCHASE -> predicates.add(
                            cb.equal(root.get("type"), TransactionType.PURCHASE)
                    );

                    case SALE -> predicates.add(
                            cb.equal(root.get("type"), TransactionType.SALE)
                    );
                }
            }

            // 🔹 from date
            if (req.getFromDate() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("createdDate"),
                                req.getFromDate()
                        )
                );
            }

            // 🔹 to date
            if (req.getToDate() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("createdDate"),
                                req.getToDate().plusDays(1).atStartOfDay()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
