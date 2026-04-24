package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum BlockStatus {
    NONE(0),
    BLOCKED(1),
    IS_BLOCKED(2);

    private final int id;

    BlockStatus(int id) {
        this.id = id;
    }

}
