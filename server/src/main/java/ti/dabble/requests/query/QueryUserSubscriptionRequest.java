package ti.dabble.requests.query;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.SubscriptionStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryUserSubscriptionRequest {
    private SubscriptionStatus status;
    private boolean isSortByCreatedDateDesc;
}
