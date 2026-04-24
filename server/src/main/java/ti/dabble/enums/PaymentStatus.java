package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {
    FAILED(0),
    PENDING(1),
    SUCCESS(2),
    CANCELED(3);

    private final int id;

    PaymentStatus(int id) {
        this.id = id;
    }

}