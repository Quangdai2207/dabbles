package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import ti.dabble.entities.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId AND n.isRead = false")
    long countTotalNotification(@Param("userId") UUID userId);

    @Query("SELECT n FROM Notification n WHERE n.id = :id")
    Notification findNotificationById(@Param("id") UUID id);

    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.isRead = false")
    List<Notification> findNotificationByRecipientId(@Param("userId") UUID userId);

    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId ORDER BY n.createdDate DESC")
    Page<Notification> findNotificationByRecipientId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.sender.id = :senderId AND n.recipient.id = :recipientId AND n.referenceId = :referenceId AND n.type = :type")
    Notification findNotificationBySenderAndRecipientAndReferenceIdAndType(@Param("senderId") UUID senderId, @Param("recipientId") UUID recipientId,
            @Param("referenceId") UUID referenceId, @Param("type") String type);
}
