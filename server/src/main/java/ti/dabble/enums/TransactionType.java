package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum TransactionType {
    WITHDRAWAL(1),
    DEPOSIT(2),
    SALE(3),
    SUBSCRIBE(4),
    PURCHASE(5);
    private final int id;
    TransactionType(int id) {
        this.id = id;
    }

}
