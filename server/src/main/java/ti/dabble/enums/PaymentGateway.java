package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum PaymentGateway {
    PAYPAL(1),
    MOMO(2),
    VNPAY(3);

    private final int id;

    PaymentGateway(int id) {
        this.id = id;
    }

}
