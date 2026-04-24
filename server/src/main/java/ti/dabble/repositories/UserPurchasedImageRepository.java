package ti.dabble.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ti.dabble.entities.Image;
import ti.dabble.entities.UserPurchasedImage;
import ti.dabble.entities.keys.UserPurchasedImageKey;
import java.util.UUID;

@Repository
public interface UserPurchasedImageRepository extends JpaRepository<UserPurchasedImage, UserPurchasedImageKey> {
    @Query("SELECT ui.image FROM UserPurchasedImage ui WHERE ui.user.id = :userId ORDER BY ui.createdDate DESC")
    Page<Image> findAllPurchasedImageByUser(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(ui) > 0 THEN true ELSE false END FROM UserPurchasedImage ui WHERE ui.image.id = :imageId AND ui.user.id = :userId")
    boolean existsUserPurchasedImageByImageIdAndUserId(@Param("imageId") UUID imageId, @Param("userId") UUID userId);
}
