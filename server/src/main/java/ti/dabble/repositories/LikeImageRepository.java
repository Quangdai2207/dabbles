package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ti.dabble.entities.LikeImage;
import ti.dabble.entities.keys.LikeImageKey;

@Repository
public interface LikeImageRepository extends JpaRepository<LikeImage, LikeImageKey> {
    @Query("SELECT li FROM LikeImage li WHERE li.user.id = :userId AND li.image.id = :imageId")
    LikeImage findByUserIdAndImageId(@Param("userId") UUID userId, @Param("imageId") UUID imageId);

    boolean existsLikeImageByUserIdAndImageId(UUID userId, UUID imageId);

    @Query("SELECT COUNT(li) FROM LikeImage li WHERE li.image.creator.id = :userId")
    long totalLikeByUserId(@Param("userId") UUID userId);
}
