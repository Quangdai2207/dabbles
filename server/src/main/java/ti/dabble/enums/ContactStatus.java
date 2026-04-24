package ti.dabble.enums;

import lombok.Getter;

@Getter
public enum ContactStatus {
    PENDING(1),
    ACCEPTED(2),
    BLOCKED(3),
    UNFOLLOW(4);

    private final int id;

    ContactStatus(int id) {
        this.id = id;
    }

}
