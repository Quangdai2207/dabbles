package ti.dabble.repositories;

import ti.dabble.entities.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Query("SELECT COUNT(u) FROM User u WHERE u.isDeleted = false")
    long countUsers();

    @Query("FROM User WHERE email = :email AND isDeleted = false")
    User findByEmail(@Param("email") String email);

    @Query("FROM User WHERE username = :username AND isDeleted = false")
    User findByUsername(@Param("username") String username);

    @Query("FROM User WHERE isDeleted = false")
    List<User> findAllUser();

    @Query("FROM User WHERE id = :id AND isDeleted = false")
    User findUserById(@Param("id") UUID id);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<User> findAllByIdInAndIsDeletedFalse(List<UUID> ids);

    List<User> findAllByUsernameInAndIsDeletedFalse(List<String> usernames);

    @Query("""
                SELECT u
                FROM User u
                WHERE lower(u.username) LIKE lower(concat(:username, '%'))
                AND u.isDeleted = false
                AND u.roleId = '3'
                AND (
                    :currentUserId IS NULL
                    OR (
                        u.id != :currentUserId
                        AND NOT EXISTS (
                            SELECT 1 FROM Contact c
                            WHERE c.status = 3
                            AND (
                                (c.user.id = :currentUserId AND c.contactUser.id = u.id)
                                OR
                                (c.user.id = u.id AND c.contactUser.id = :currentUserId)
                            )
                        )
                    )
                )
            """)
    Page<User> searchByUsername(
            @Param("username") String username,
            @Param("currentUserId") UUID currentUserId, // Có thể truyền null vào đây
            Pageable pageable);

    boolean existsByUsername(String username);
}
