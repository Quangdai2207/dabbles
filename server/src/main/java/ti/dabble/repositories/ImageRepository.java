package ti.dabble.repositories;

import ti.dabble.entities.Image;
import ti.dabble.enums.TransactionType;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {
    @Query("SELECT COUNT(i) FROM Image i WHERE i.creator.id = :creatorId AND i.isDeleted = false")
    Long countByCreatorId(@Param("creatorId") UUID creatorId);

    @Query("SELECT i FROM Image i WHERE i.id = :id AND i.isDeleted = false")
    Image findImageById(@Param("id") UUID id);

    @Query("SELECT  i FROM Image i WHERE i.creator.id = :creatorId AND i.isPublic = true AND i.isDeleted = false ORDER BY i.id DESC")
    Page<Image> findByCreatorIdAndIsPublic(@Param("creatorId") UUID creatorId, Pageable pageable);

    @Query("SELECT  i FROM Image i WHERE i.creator.id = :creatorId AND i.isDeleted = false ORDER BY i.id DESC")
    Page<Image> findAllByCreatorId(@Param("creatorId") UUID creatorId, Pageable pageable);

    @Query("SELECT i FROM Image i WHERE i.id = :id AND i.isPublic = true AND i.isDeleted = false ORDER BY i.id DESC")
    Image findImageByIdAndIsPublic(@Param("id") UUID id);

    @Query("SELECT i FROM Image i WHERE i.isDeleted = false ORDER BY i.id DESC")
    Page<Image> findAllImages(Pageable pageable);

    @Query("SELECT i FROM Image i " +
            "JOIN LikeImage li ON li.image.id = i.id " +
            "WHERE li.user.id = :userId " +
            "AND i.isDeleted = false " +
            "AND (" +
            "   i.creator.isPublic = true " +
            "   OR " +
            "   i.creator.id = :userId " +
            "   OR " +
            "   EXISTS (" +
            "       SELECT c FROM Contact c " +
            "       WHERE c.user.id = :userId " +
            "       AND c.contactUser.id = i.creator.id" +
            "   )" +
            ") " +
            "ORDER BY li.createdDate DESC")
    Page<Image> findAllLikeImagesOfUser(
            @Param("userId") UUID userId,
            Pageable pageable);

    @Query("SELECT i FROM Image i WHERE i.isDeleted = true ORDER BY i.createdDate DESC")
    List<Image> findAllDeletedImages();

    @Query("SELECT i FROM Image i WHERE i.isDeleted = true AND i.creator.id = :creatorId ORDER BY i.createdDate DESC")
    List<Image> findAllDeletedImagesOfUser(@Param("creatorId") UUID creatorId);

    @Query("SELECT i FROM Image i " +
            "JOIN ImageCategory ic ON ic.image.id = i.id " +
            "WHERE ic.category.id = :categoryId AND ic.category.isDeleted = false AND i.isDeleted = false AND i.isPublic = true ORDER BY i.id DESC")
    Page<Image> findImagesByCategoryId(
            @Param("categoryId") UUID categoryId,
            Pageable pageable);

    @Query("""
                SELECT i
                FROM Image i
                JOIN i.creator u
                WHERE i.isDeleted = false
                AND i.isPublic = true
                AND EXISTS (
                    SELECT 1 FROM ImageCategory ic
                    WHERE ic.image.id = i.id
                    AND ic.category.id = :categoryId
                    AND ic.category.isDeleted = false
                )
                AND NOT EXISTS (
                    SELECT 1 FROM Contact cBlock
                    WHERE cBlock.status = 3
                    AND (
                        (cBlock.user.id = :userId AND cBlock.contactUser.id = u.id)
                        OR
                        (cBlock.user.id = u.id AND cBlock.contactUser.id = :userId)
                    )
                )
                AND (
                    u.id = :userId
                    OR u.isPublic = true
                    OR (
                        u.isPublic = false
                        AND EXISTS (
                            SELECT 1 FROM Contact c
                            WHERE c.user.id = :userId
                            AND c.contactUser.id = u.id
                            AND c.status = 2
                        )
                    )
                )
                ORDER BY i.id DESC
            """)
    Page<Image> findImagesByCategoryIdWithAuth(
            @Param("userId") UUID userId,
            @Param("categoryId") UUID categoryId,
            Pageable pageable);

    @Query("SELECT i FROM Image i " +
            "JOIN BoardImage bi ON bi.image.id = i.id " +
            "WHERE bi.board.id = :boardId AND bi.board.isDeleted = false ORDER BY i.createdDate DESC")
    Page<Image> findImagesByBoardId(
            @Param("boardId") String boardId,
            Pageable pageable);

    @Query("SELECT i FROM Image i " +
            "JOIN BoardImage bi ON bi.image.id = i.id " +
            "WHERE bi.board.id = :boardId AND bi.board.isDeleted = false AND bi.board.isSecret = false ORDER BY i.createdDate DESC")
    Page<Image> findImagesByBoardIdAndNotSecret(
            @Param("boardId") String boardId,
            Pageable pageable);

    @Query(value = """
            SELECT i.*
            FROM images i
            JOIN users u ON u.id = i.creator_id
            WHERE i.is_deleted = false
            AND i.is_public = true
            
            AND NOT EXISTS (
                SELECT 1 FROM contacts cb
                WHERE cb.status = 3
                AND (
                    (cb.user_id = :userId AND cb.contact_user_id = u.id)
                    OR
                    (cb.user_id = u.id AND cb.contact_user_id = :userId)
                )
            )
            
            AND (u.id = :userId OR
                (u.is_public = true)
                OR (
                    (u.is_public = false)
                    AND EXISTS (
                        SELECT 1
                        FROM contacts c
                        WHERE c.user_id = :userId
                        AND c.contact_user_id = u.id
                        AND c.status = 2
                    )
                )
            )
            ORDER BY
              CASE
                WHEN EXISTS (
                  SELECT 1
                  FROM images_categories ic
                  JOIN user_followed_categories ufc
                    ON ic.category_id = ufc.category_id
                  WHERE ic.image_id = i.id
                    AND ufc.user_id = :userId
                ) THEN 1
                WHEN EXISTS (
                  SELECT 1
                  FROM contacts c
                  WHERE c.user_id = :userId
                    AND c.contact_user_id = i.creator_id
                ) THEN 2
                ELSE 3
              END,
              i.id DESC
            """, countQuery = """
            SELECT COUNT(DISTINCT i.id)
            FROM images i
            JOIN users u ON u.id = i.creator_id
            WHERE i.is_deleted = false
            
            AND NOT EXISTS (
                SELECT 1 FROM contacts cb
                WHERE cb.status = 3
                AND (
                    (cb.user_id = :userId AND cb.contact_user_id = u.id)
                    OR
                    (cb.user_id = u.id AND cb.contact_user_id = :userId)
                )
            )
            
            AND (
                u.id = :userId
                OR (u.is_public = true AND i.is_public = true)
                OR (
                    u.is_public = false
                    AND i.is_public = true
                    AND EXISTS (
                        SELECT 1
                        FROM contacts c
                        WHERE c.user_id = :userId
                        AND c.contact_user_id = u.id
                        AND c.status = 2
                    )
                )
            )
            """, nativeQuery = true)
    Page<Image> findImagesForUserHomePage(
            @Param("userId") String userId,
            Pageable pageable);

    @Query("SELECT i FROM Image i WHERE i.creator.isPublic = true AND i.isPublic = true AND i.isDeleted = false ORDER BY i.id DESC")
    Page<Image> findImagesForHomePage(Pageable pageable);

    // Admin
    @Query("SELECT distinct i FROM Image i " +
            "JOIN BoardImage bi ON bi.image.id = i.id " +
            "WHERE bi.board.id = :boardId AND bi.board.isDeleted = false ORDER BY i.createdDate DESC")
    Page<Image> findImagesByBoardIdByAdmin(
            @Param("boardId") String boardId,
            Pageable pageable);

    @Query("SELECT i FROM Image i " +
            "JOIN ImageCategory ic ON ic.image.id = i.id " +
            "WHERE ic.category.id = :categoryId AND ic.category.isDeleted = false AND i.isDeleted = false ORDER BY i.id DESC")
    Page<Image> findImagesByCategoryIdByAdmin(
            @Param("categoryId") UUID categoryId,
            Pageable pageable);

    @Query(value = """
            SELECT DISTINCT i.*
            FROM images i
            JOIN users u ON u.id = i.creator_id
            
            LEFT JOIN images_categories ic ON i.id = ic.image_id
            LEFT JOIN categories cat ON ic.category_id = cat.id
            
            WHERE i.is_deleted = false
            AND i.is_public = true
            AND cat.is_deleted = false
            AND (
                LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR
                LOWER(cat.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            
            AND NOT EXISTS (
                SELECT 1 FROM contacts cb
                WHERE cb.status = 3
                AND (
                    (cb.user_id = :userId AND cb.contact_user_id = u.id)
                    OR
                    (cb.user_id = u.id AND cb.contact_user_id = :userId)
                )
            )
            
            AND (
                u.id = :userId
                OR u.is_public = true
                OR (
                    u.is_public = false
                    AND EXISTS (
                        SELECT 1 FROM contacts c
                        WHERE c.user_id = :userId
                        AND c.contact_user_id = u.id
                        AND c.status = 2
                    )
                )
            )
            ORDER BY
              CASE
                WHEN EXISTS (
                  SELECT 1 FROM contacts c
                  WHERE c.user_id = :userId
                  AND c.contact_user_id = i.creator_id
                  AND c.status = 2
                ) THEN 1
                ELSE 2
              END,
              i.id DESC
            """, countQuery = """
            SELECT COUNT(DISTINCT i.id)
            FROM images i
            JOIN users u ON u.id = i.creator_id
            LEFT JOIN images_categories ic ON i.id = ic.image_id
            LEFT JOIN categories cat ON ic.category_id = cat.id
            WHERE i.is_deleted = false
            AND i.is_public = true
            AND (
                LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR
                LOWER(cat.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND NOT EXISTS (
                SELECT 1 FROM contacts cb
                WHERE cb.status = 3
                AND (
                    (cb.user_id = :userId AND cb.contact_user_id = u.id)
                    OR
                    (cb.user_id = u.id AND cb.contact_user_id = :userId)
                )
            )
            AND (
                u.id = :userId
                OR u.is_public = true
                OR (
                    u.is_public = false
                    AND EXISTS (
                        SELECT 1 FROM contacts c
                        WHERE c.user_id = :userId
                        AND c.contact_user_id = u.id
                        AND c.status = 2
                    )
                )
            )
            """, nativeQuery = true)
    Page<Image> searchImagesByKeyword(
            @Param("keyword") String keyword,
            @Param("userId") String userId, // Chú ý kiểu dữ liệu (UUID hay String)
            Pageable pageable);

    @Query("SELECT COUNT(i) FROM Image i WHERE i.isDeleted = false")
    long countImages();
}
