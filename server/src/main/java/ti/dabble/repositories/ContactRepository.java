package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import ti.dabble.dtos.BlockContactDto;
import ti.dabble.entities.Contact;
import ti.dabble.entities.keys.ContactKey;

@Repository
public interface ContactRepository extends JpaRepository<Contact, ContactKey> {
    @Query("FROM Contact c WHERE c.user.id = :user_id OR c.contactUser.id = :user_id")
    List<Contact> findAllContactOfUser(@Param("user_id") UUID user_id);

    @Query("FROM Contact c WHERE c.user.id = :userId AND c.contactUser.id = :contactUserId")
    Contact findByUserIdAndContactUserId(
            @Param("userId") UUID userId,
            @Param("contactUserId") UUID contactUserId);

    @Query("FROM Contact c WHERE c.contactUser.id = :contactUserId AND c.status = :status")
    List<Contact> findAllFollowerOfUser(
            @Param("contactUserId") UUID contactUserId,
            @Param("status") int status);

    @Query("FROM Contact c WHERE c.user.id = :userId AND c.status = 2")
    List<Contact> findAllFollowingOfUser(
            @Param("userId") UUID userId);

    @Query("FROM Contact c WHERE c.user.id = :userId AND c.status = 3")
    List<Contact> findAllBlockedOfUser(
            @Param("userId") UUID userId);

    @Query("FROM Contact c WHERE c.contactUser.id = :contactUserId AND c.status = :status")
    List<Contact> findByContactUserIdAndStatus(
            @Param("contactUserId") UUID contactUserId,
            @Param("status") int status);

    @Query("SELECT COUNT(c) FROM Contact c WHERE  c.contactUser.id = :userId AND c.status = 2")
    long countFollowerOfUser(@Param("userId") UUID userId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE  c.user.id = :userId AND c.status = 2")
    long countFollowingOfUser(@Param("userId") UUID userId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE  c.contactUser.id = :userId AND c.status = 1")
    long countPendingOfUser(@Param("userId") UUID userId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Contact c " +
            "WHERE (c.user.id = :userId1 AND c.contactUser.id = :userId2 AND c.status = 3) " +
            "OR (c.user.id = :userId2 AND c.contactUser.id = :userId1 AND c.status = 3)")
    boolean hasBlockedRelationship(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Contact c WHERE c.user.id = :user AND c.contactUser.id = :blockedUser AND c.status = 3")
    boolean hasBlockUser(@Param("user") UUID user, @Param("blockedUser") UUID blockedUser);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Contact c WHERE c.user.id = :user AND c.contactUser.id = :contactUser AND c.status = 2")
    boolean hasFollowUser(@Param("user") UUID user, @Param("contactUser") UUID contactUser);

    @Query("""
                SELECT new ti.dabble.dtos.BlockContactDto(
                    CASE
                        WHEN c.user.id = :userId THEN c.contactUser.id
                        ELSE c.user.id
                    END,
                    CASE
                        WHEN c.user.id = :userId THEN ti.dabble.enums.BlockStatus.BLOCKED
                        ELSE ti.dabble.enums.BlockStatus.IS_BLOCKED
                    END
                )
                FROM Contact c
                WHERE c.status = 3
                  AND (c.user.id = :userId OR c.contactUser.id = :userId)
            """)
    List<BlockContactDto> findAllBlockRelations(@Param("userId") UUID userId);

}
