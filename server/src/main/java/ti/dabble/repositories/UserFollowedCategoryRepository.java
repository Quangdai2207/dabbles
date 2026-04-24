package ti.dabble.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ti.dabble.entities.UserFollowedCategory;
import ti.dabble.entities.keys.UserFollowedCategoryKey;

@Repository
public interface UserFollowedCategoryRepository extends JpaRepository<UserFollowedCategory, UserFollowedCategoryKey> {
    @Query("SELECT EXISTS (SELECT 1 FROM UserFollowedCategory ufc WHERE ufc.user.id = :userId)")
    boolean existsByUserId(@Param("userId") UUID userId);

    @Query("SELECT ufc FROM UserFollowedCategory ufc WHERE ufc.user.id = :userId")
    List<UserFollowedCategory> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT ufc FROM UserFollowedCategory ufc WHERE ufc.category.id = :categoryId")
    List<UserFollowedCategory> findByCategoryId(@Param("categoryId") UUID categoryId);

    @Modifying
    @Query("DELETE FROM UserFollowedCategory ufc WHERE ufc.category.id IN :categoryIds AND ufc.user.id = :userId")
    void deleteByCategoryIdsAndUserId(@Param("categoryIds") List<UUID> categoryIds, @Param("userId") UUID userId);

}
