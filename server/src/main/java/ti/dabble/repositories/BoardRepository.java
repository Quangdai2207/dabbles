package ti.dabble.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import ti.dabble.entities.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, String> {
    @Query("SELECT b FROM Board b WHERE b.slug = :slug AND b.user.id = :userId AND b.isDeleted = false")
    Board findBySlugAndUserId(@Param("slug") String slug, @Param("userId") String userId);

    @Query("SELECT b FROM Board b WHERE b.id = :boardId AND b.isDeleted = false")
    Board findBoardById(@Param("boardId") String boardId);

    @Query("SELECT b FROM Board b WHERE b.id = :boardId AND b.isSecret = false AND b.isDeleted = false")
    Board findBoardByIdAndNotSecret(@Param("boardId") String boardId);

    @Query("SELECT b FROM Board b WHERE b.user.id = :userId AND b.isDefault = true AND b.isDeleted = false")
    Board findDefaultBoardByUserId(@Param("userId") String userId);

    @Query("SELECT b FROM Board b WHERE b.user.id = :userId AND b.isDeleted = false")
    Page<Board> findAllByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT b FROM Board b WHERE b.user.id = :userId AND b.isSecret = false AND b.isDeleted = false")
    Page<Board> findAllByUserIdAndNotSecret(@Param("userId") String userId, Pageable pageable);
}
