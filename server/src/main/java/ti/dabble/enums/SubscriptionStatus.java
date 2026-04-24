package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum SubscriptionStatus {
    ACTIVE(1),
    EXPIRED(2),
    CANCELED(3);

    private final int id;

    SubscriptionStatus(int id) {
        this.id = id;
    }

}
