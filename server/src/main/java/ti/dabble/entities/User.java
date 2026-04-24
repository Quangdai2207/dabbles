package ti.dabble.entities;

import com.github.f4b6a3.uuid.UuidCreator;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR) // <--- THÊM DÒNG NÀY
    @Builder.Default // <--- Quan trọng: Báo Lombok dùng giá trị mặc định này
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @Column(name = "username", length = 50)
    private String username;
    @Column(name = "firstname", length = 100)
    private String firstname;

    @Column(name = "lastname", length = 100)
    private String lastname;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "password")
    private String password;

    @Column(name = "role_id")
    private String roleId;

    @Column(name = "warning")
    private int warning;

    @Column(name = "bio")
    private String bio;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @Schema(example = "dd/MM/yyyy")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
             this.id = UuidCreator.getTimeOrderedEpoch(); 
        }
        this.createdDate = LocalDateTime.now();
        this.isPublic = false;
        this.warning = 0;
        this.isDeleted = false;

    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}