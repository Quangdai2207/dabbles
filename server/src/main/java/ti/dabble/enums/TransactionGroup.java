package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum TransactionGroup {
    WALLET_FLOW, // withdrawal + deposit + subscribe
    PURCHASE,
    SALE

}
