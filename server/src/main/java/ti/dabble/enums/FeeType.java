package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum FeeType {
    SALE(1),
    DEPOSIT(2);
    private final int id;
    FeeType(int id) {
        this.id = id;
    }
}
