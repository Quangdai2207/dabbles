package ti.dabble.enums;

public enum Role {
    SUPERADMIN(1),
    ADMIN(2),
    USER(3);

    private final int id;

    Role(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
