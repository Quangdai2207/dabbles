package ti.dabble.entities;

import jakarta.persistence.*;
import lombok.*;
import ti.dabble.entities.keys.ContactKey;

import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    @Builder.Default
    @EmbeddedId
    private ContactKey id = new ContactKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("contactUserId")
    @JoinColumn(name = "contact_user_id")
    private User contactUser;

    @Column(name = "status") // 1:"PENDING", 2:"ACCEPTED", 3:"BLOCKED"
    private int status;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}