package ti.dabble.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import ti.dabble.entities.ImageCategory;
import ti.dabble.entities.keys.ImageCategoryKey;

@Repository
public interface ImageCategoryRepository extends JpaRepository<ImageCategory, ImageCategoryKey> {
    @Query("SELECT ic FROM ImageCategory ic WHERE ic.image.id = :imageId AND ic.category.id = :categoryId AND ic.image.isDeleted = false AND ic.category.isDeleted = false")
    ImageCategory findImageCategoryByImageIdAndCategoryId(@Param("imageId") UUID imageId,
            @Param("categoryId") UUID categoryId);

    @Query("SELECT ic FROM ImageCategory ic WHERE ic.image.id = :imageId AND ic.category.isDeleted = false AND ic.image.isDeleted = false")
    List<ImageCategory> findImageCategoriesByImageId(@Param("imageId") UUID imageId);

     @Query("SELECT ic FROM ImageCategory ic WHERE ic.category.id = :categoryId AND ic.category.isDeleted = false AND ic.image.isDeleted = false")
    List<ImageCategory> findImageCategoriesByCategoryId(@Param("categoryId") UUID categoryId);

    @Modifying
    @Query("DELETE FROM ImageCategory ic WHERE ic.category.id = :categoryId")
    void deleteByCategory(@Param("categoryId") UUID categoryId);
}
