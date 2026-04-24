package ti.dabble.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import ti.dabble.entities.BoardImage;

@Repository
public interface BoardImageRepository extends JpaRepository<BoardImage, String> {
    @Query("SELECT bi FROM BoardImage bi WHERE bi.board.id = :boardId AND bi.image.id = :imageId AND bi.board.isDeleted = false")
    BoardImage findBoardImageByBoardIdAndImageId(@Param("boardId") String boardId, @Param("imageId") String imageId);

    @Query("SELECT bi FROM BoardImage bi WHERE bi.board.id = :boardId AND bi.board.isDeleted = false")
    List<BoardImage> findAllByBoardId(@Param("boardId") String boardId);

    @Query("SELECT bi FROM BoardImage bi WHERE bi.board.id = :boardId AND bi.image.id != :imageId AND bi.board.isDeleted = false")
    List<BoardImage> findAllByBoardIdWithoutImageId(@Param("boardId") String boardId, @Param("imageId") String imageId);
}
