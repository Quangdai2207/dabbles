package ti.dabble.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ti.dabble.entities.UserSubscription;

public interface UserSubscriptionRepository
                extends JpaRepository<UserSubscription, UUID>, JpaSpecificationExecutor<UserSubscription> {
        @Query("SELECT us FROM UserSubscription us WHERE us.user.id = :userId ORDER BY us.createdDate DESC LIMIT 1")
        UserSubscription findNewestByUserId(@Param("userId") UUID userId);

        @Query("""
                        SELECT s
                        FROM UserSubscription s
                        WHERE s.endDate = (
                            SELECT MAX(s2.endDate)
                            FROM UserSubscription s2
                            WHERE s2.user = s.user
                        )
                        AND s.endDate BETWEEN :startDate AND :endDate
                        """)
        List<UserSubscription> findLatestExpiringSubscriptionsPerUser(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT us FROM UserSubscription us WHERE us.endDate < :localDatetime AND us.status != 2")
        List<UserSubscription> findExpiredSubscriptionByStatus(@Param(("localDatetime")) LocalDateTime localDateTime);

        @Query("SELECT us.endDate FROM UserSubscription us WHERE us.user.id = :userId AND us.endDate > :now ORDER BY us.endDate DESC LIMIT 1")
        LocalDateTime getExpiredDayOfUser(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
}
