// package ti.dabble.services.board;

// import org.jspecify.annotations.Nullable;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;

// import ti.dabble.dtos.BoardResponseDto;
// import ti.dabble.dtos.UserSummaryDto;
// import ti.dabble.entities.Board;
// import ti.dabble.entities.BoardImage;
// import ti.dabble.entities.Image;
// import ti.dabble.entities.User;
// import ti.dabble.helpers.FileHelper;
// import ti.dabble.mapper.FileMapper;
// import ti.dabble.repositories.*;
// import ti.dabble.requests.*;
// import ti.dabble.response_status.Status;
// import ti.dabble.response_status.StatusObject;
// import ti.dabble.services.user.UserService;

// @Service
// public class BoardService implements IBoardService {
//     @Autowired
//     private ImageRepository imageRepository;
//     @Autowired
//     private BoardRepository boardRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private ContactRepository contactRepository;
//     @Autowired
//     private BoardImageRepository boardImageRepository;

//     @Override
//     public StatusObject<BoardResponseDto> createBoard(
//             CreateBoardRequest request,
//             String userEmail
//     ) {
//         StatusObject<BoardResponseDto> statusObject = new StatusObject<>(false, "", "", null);
//         try {
//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 statusObject.setErrorMessage("User not found");
//                 return statusObject;
//             }
//             String slug = FileHelper.generateSlug(request.getName());
//             if (boardRepository.findBySlugAndUserId(slug, user.getId()) != null) {
//                 statusObject.setErrorMessage("Board name already exists. Please choose another name!");
//                 return statusObject;
//             }
//             Board newBoard = new Board();
//             newBoard.setUser(user);
//             newBoard.setName(request.getName());
//             newBoard.setDescription(request.getDescription());
//             newBoard.setSecret(request.isSecret());
//             newBoard.setSlug(slug);

//             boardRepository.save(newBoard);
//             BoardResponseDto boardResponseDto = getBoardResponseDto(newBoard);
//             statusObject.setMessage("Board created successfully");
//             statusObject.setData(boardResponseDto);
//             return statusObject;
//         } catch (Exception e) {
//             e.printStackTrace();
//             statusObject.setErrorMessage("Failed to create board");
//             return statusObject;
//         }
//     }

//     @Transactional
//     @Override
//     public Status addImageToBoard(
//             AddImageToBoardRequest addImageToBoardRequest,
//             String userEmail
//     ) {
//         Status status = new Status(false, "", "");
//         try {
//             Board board = boardRepository.findBoardById(addImageToBoardRequest.getBoardId());
//             if (board == null) {
//                 status.setErrorMessage("Board not found");
//                 return status;
//             }
//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 status.setErrorMessage("User not found");
//                 return status;
//             }
//             if (!board.getUser()
//                     .getId()
//                     .equals(user.getId())) {
//                 status.setErrorMessage("User is not the owner of the board");
//                 return status;
//             }
//             Image image = imageRepository.findImageById(addImageToBoardRequest.getImageId());
//             if (image == null) {
//                 status.setErrorMessage("Image not found");
//                 return status;
//             }
//             if (!image.getCreator()
//                     .getId()
//                     .equalsIgnoreCase(user.getId()) && !image.isPublic()) {
//                 status.setErrorMessage("You is not the owner of the image and this image is private");
//                 return status;
//             }
//             BoardImage newBoardImage = new BoardImage();
//             newBoardImage.setBoard(board);
//             newBoardImage.setImage(image);
//             newBoardImage.setAddedBy(user);
//             boardImageRepository.save(newBoardImage);
//             if (board.getCoverImageId() == null) {
//                 board.setCoverImageId(image.getId());
//                 boardRepository.save(board);
//             }
//             status.setIsSuccess(true);
//             status.setMessage("Image added to board successfully");
//             return status;

//         } catch (Exception e) {
//             e.printStackTrace();
//             status.setErrorMessage(e.getMessage());
//             return status;
//         }
//     }

//     @Transactional
//     @Override
//     public Status quickSaveImage(
//             QuickSaveImageRequest quickSaveImageRequest,
//             String userEmail
//     ) {
//         Status status = new Status(false, "", "");
//         try {

//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 status.setErrorMessage("User not found");
//                 return status;
//             }

//             Image image = imageRepository.findImageById(quickSaveImageRequest.getImageId());
//             if (image == null) {
//                 status.setErrorMessage("Image not found");
//                 return status;
//             }
//             if (!image.getCreator()
//                     .getId()
//                     .equalsIgnoreCase(user.getId()) && !image.isPublic()) {
//                 status.setErrorMessage("You are not the owner of the image and this image is private");
//                 return status;
//             }

//             Board board = boardRepository.findDefaultBoardByUserId(user.getId());
//             if (board == null) {
//                 status.setErrorMessage("Default board not found");
//                 return status;
//             }
//             BoardImage newBoardImage = new BoardImage();
//             newBoardImage.setBoard(board);
//             newBoardImage.setImage(image);
//             newBoardImage.setAddedBy(user);
//             boardImageRepository.save(newBoardImage);

//             status.setIsSuccess(true);
//             status.setMessage("Saved successfully");
//             return status;

//         } catch (Exception e) {
//             e.printStackTrace();
//             status.setErrorMessage(e.getMessage());
//             return status;
//         }
//     }

//     @Override
//     public Status deleteBoard(
//             String boardId,
//             String userEmail
//     ) {
//         Status status = new Status(false, "", "");
//         try {
//             Board board = boardRepository.findBoardById(boardId);
//             if (board == null) {
//                 status.setErrorMessage("Board not found");
//                 return status;
//             }
//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 status.setErrorMessage("User not found");
//                 return status;
//             }
//             if (!board.getUser()
//                     .getId()
//                     .equals(user.getId())) {
//                 status.setErrorMessage("User is not the owner of the board");
//                 return status;
//             }
//             board.setDeleted(true);
//             boardRepository.save(board);
//             status.setIsSuccess(true);
//             status.setMessage("Delete board successfully");
//             return status;

//         } catch (Exception e) {
//             e.printStackTrace();
//             status.setErrorMessage(e.getMessage());
//             return status;
//         }
//     }

//     @Override
//     public StatusObject<BoardResponseDto> updateBoard(
//             UpdateBoardRequest updateBoardRequest,
//             String boardId,
//             String userEmail
//     ) {
//         StatusObject<BoardResponseDto> statusObject = new StatusObject<>(false, "", "", null);
//         try {
//             Board board = boardRepository.findBoardById(boardId);
//             if (board == null) {
//                 statusObject.setErrorMessage("Board not found");
//                 return statusObject;
//             }
//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 statusObject.setErrorMessage("User not found");
//                 return statusObject;
//             }
//             if (!board.getUser()
//                     .getId()
//                     .equals(user.getId())) {
//                 statusObject.setErrorMessage("User is not the owner of the board");
//                 return statusObject;
//             }
//             board.setName(updateBoardRequest.getName());
//             board.setDescription(updateBoardRequest.getDescription());
//             board.setSecret(updateBoardRequest.isSecret());
//             boardRepository.save(board);
//             statusObject.setSuccess(true);
//             statusObject.setMessage("Updated board successfully");
//             statusObject.setData(getBoardResponseDto(board));
//             return statusObject;

//         } catch (Exception e) {
//             e.printStackTrace();
//             statusObject.setErrorMessage(e.getMessage());
//             return statusObject;
//         }
//     }

//     @Override
//     public Status removeImageFromBoard(
//             DeleteImageFromBoardRequest deleteImageFromBoardRequest,
//             String userEmail
//     ) {
//         Status status = new Status(false, "", "");
//         try {
//             Board board = boardRepository.findBoardById(deleteImageFromBoardRequest.getBoardId());
//             if (board == null) {
//                 status.setErrorMessage("Board not found");
//                 return status;
//             }
//             User user = userRepository.findByEmail(userEmail);
//             if (user == null) {
//                 status.setErrorMessage("User not found");
//                 return status;
//             }
//             if (!board.getUser()
//                     .getId()
//                     .equals(user.getId())) {
//                 status.setErrorMessage("User is not the owner of the board");
//                 return status;
//             }

//             BoardImage boardImage = boardImageRepository.findBoardImageByBoardIdAndImageId(
//                     deleteImageFromBoardRequest.getBoardId(),
//                     deleteImageFromBoardRequest.getImageId()
//             );
//             if (boardImage == null) {
//                 status.setErrorMessage("Image is not in this board");
//                 return status;
//             }
//             if (board.getCoverImageId()
//                     .equalsIgnoreCase(boardImage.getImage()
//                                               .getId())) {
//                 List<BoardImage> boardImages = boardImageRepository.findAllByBoardIdWithoutImageId(
//                         board.getId(),
//                         boardImage.getImage()
//                                 .getId()
//                 );
//                 if (!boardImages.isEmpty()) {
//                     board.setCoverImageId(boardImages.get(0)
//                                                   .getImage()
//                                                   .getId());
//                     boardRepository.save(board);
//                 }

//             }
//             boardImageRepository.delete(boardImage);

//             status.setIsSuccess(true);
//             status.setMessage("Removed image from board successfully");
//             return status;

//         } catch (Exception e) {
//             e.printStackTrace();
//             status.setErrorMessage(e.getMessage());
//             return status;
//         }
//     }

//     @Override
//     public StatusObject<List<BoardResponseDto>> getBoardsByUserId(
//             String userId,
//             PaginationRequest paginationRequest,
//             @Nullable String authEmail
//     ) {
//         StatusObject<List<BoardResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
//         try {
//             User owner = userRepository.findUserById(userId);
//             if (owner == null) {
//                 statusObject.setErrorMessage("User not found");
//                 return statusObject;
//             }

//             boolean isOwner = false;
//             boolean isFollowing = false;
//             if (authEmail != null) {
//                 User authUser = userRepository.findByEmail(authEmail);
//                 if (authUser != null && authUser.getId()
//                         .equals(userId)) {
//                     isOwner = true;
//                 } else if (authUser != null) {
//                     isFollowing = contactRepository.hasFollowUser(authUser.getId(), userId);
//                 }
//             }
//             Pageable pageable = PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize());
//             Page<Board> pageResult;
//             if (isOwner) {
//                 pageResult = boardRepository.findAllByUserId(userId, pageable);
//             } else {
//                 if (owner.isPublic()) {
//                     pageResult = boardRepository.findAllByUserIdAndNotSecret(userId, pageable);
//                 } else {
//                     if (isFollowing) {
//                         pageResult = boardRepository.findAllByUserIdAndNotSecret(userId, pageable);
//                     } else {
//                         pageResult = null;
//                     }
//                 }
//             }
//             if (pageResult == null || pageResult.isEmpty()) {
//                 statusObject.setSuccess(true);
//                 statusObject.setMessage("No image found");
//                 return statusObject;
//             }

//             List<BoardResponseDto> boardResponseDtos = pageResult.getContent()
//                     .stream()
//                     .map(this::getBoardResponseDto
//                     )
//                     .toList();
//             statusObject.setSuccess(true);
//             statusObject.setMessage("Get all images successfully");
//             statusObject.setData(boardResponseDtos);
//             return statusObject;
//         } catch (Exception e) {
//             statusObject.setErrorMessage(e.getMessage());
//             return statusObject;
//         }
//     }

//     @Override
//     public StatusObject<BoardResponseDto> getBoardById(
//             String boardId,
//             @Nullable String authEmail
//     ) {
//         return null;
//     }

//     @Override
//     public void createDefaultBoardForUser(User user) {
//         Board defaultBoard = new Board();
//         defaultBoard.setUser(user); // User này đã được Managed bởi Hibernate
//         defaultBoard.setDefault(true);
//         defaultBoard.setName("Unorganized ideas"); // Nên dùng Constant
//         defaultBoard.setSecret(false);
//         boardRepository.save(defaultBoard);
//     }

//     private BoardResponseDto getBoardResponseDto(Board board) {
//         UserSummaryDto owner = FileMapper.getUserSummaryDto(board.getUser());
//         return BoardResponseDto.builder()
//                 .id(board.getId())
//                 .name(board.getName())
//                 .isSecret(board.isSecret())
//                 .isDefault(board.isDefault())
//                 .description(board.getDescription())
//                 .coverImageId(board.getCoverImageId())
//                 .slug(board.getSlug())
//                 .owner(owner)
//                 .createdDate(board.getCreatedDate())
//                 .build();
//     }
// }
