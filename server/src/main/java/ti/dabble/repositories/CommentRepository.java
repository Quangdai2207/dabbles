package ti.dabble.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.repository.query.Param;

import ti.dabble.entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    Comment findCommentById(UUID id);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.image.id = :imageId")
    long countCommentByImageId(@Param("imageId") UUID imageId);

    @Query("SELECT c FROM Comment c WHERE c.image.id = :imageId ORDER BY c.createdDate DESC")
    List<Comment> findCommentsByImageId(@Param("imageId") UUID imageId);

    // @Query("SELECT c FROM Comment c WHERE c.image.id = :imageId AND c.createdDate
    // < :cursor ORDER BY c.createdDate DESC")
    // Page<Comment> findCommentsByImageIdWithCursor(@Param("imageId") String
    // imageId, LocalDateTime cursor, Pageable pageable);
}