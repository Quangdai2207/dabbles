package ti.dabble.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import ti.dabble.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    @Query("SELECT c FROM Category c WHERE c.id = :id AND c.isDeleted = false")
    Category findCategoryById(@Param("id") UUID id);

    @Query("SELECT c FROM Category c WHERE c.slug = :slug AND c.isDeleted = false")
    Category findCategoryBySlug(@Param("slug") String slug);

    boolean existsByNameIgnoreCaseAndIsDeletedFalse(String name);

    @Query("SELECT c FROM Category c WHERE c.isDeleted = false")
    List<Category> findAllCategories();

    @Query("SELECT c FROM Category c WHERE c.isDeleted = false AND c.id IN :categoryIds")
    List<Category> findCategoriesByIds(@Param("categoryIds") List<UUID> categoryIds);

    @Query("SELECT COUNT(c) FROM Category c WHERE c.isDeleted = false")
    long countCategories();

}
