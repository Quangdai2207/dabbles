// package ti.dabble.services.board;

// import java.util.List;

// import javax.annotation.Nullable;

// import ti.dabble.dtos.BoardResponseDto;
// import ti.dabble.entities.User;
// import ti.dabble.requests.*;
// import ti.dabble.response_status.Status;
// import ti.dabble.response_status.StatusObject;

// public interface IBoardService {
//     StatusObject<BoardResponseDto> createBoard(CreateBoardRequest request, String userEmail);
//     Status addImageToBoard(AddImageToBoardRequest addImageToBoardRequest, String userEmail);
//     Status quickSaveImage(QuickSaveImageRequest quickSaveImageRequest, String userEmail);
//     Status deleteBoard(String boardId, String userEmail);
//     StatusObject<BoardResponseDto> updateBoard(UpdateBoardRequest updateBoardRequest, String boardId, String userEmail);
//     Status removeImageFromBoard(DeleteImageFromBoardRequest deleteImageFromBoardRequest, String userEmail);
//     StatusObject<List<BoardResponseDto>> getBoardsByUserId(String userId, PaginationRequest paginationRequest ,@Nullable String authEmail);
//     StatusObject<BoardResponseDto> getBoardById(String boardId, @Nullable String authEmail);
//     // get board by user, get board by id
//     void createDefaultBoardForUser(User user);
// }
