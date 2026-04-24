// package ti.dabble.controllers;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.RequestMapping;

// import jakarta.validation.Valid;
// import ti.dabble.dtos.BoardResponseDto;
// import ti.dabble.requests.AddImageToBoardRequest;
// import ti.dabble.requests.CreateBoardRequest;
// import ti.dabble.requests.QuickSaveImageRequest;
// import ti.dabble.response_status.Status;
// import ti.dabble.response_status.StatusObject;
// import ti.dabble.services.board.IBoardService;

// @RestController
// @RequestMapping("/api/board")
// class BoardController {
//     @Autowired
//     private IBoardService boardService;

//     @PostMapping(value = "/create-board", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<StatusObject<BoardResponseDto>> createBoard(@Valid @RequestBody CreateBoardRequest request, Authentication authentication) {
//         StatusObject<BoardResponseDto> statusObject = boardService.createBoard(request, authentication.getName());
//         return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(statusObject);
//     }

//     @PostMapping(value = "/add-image-to-board", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<Status> addImageToBoard(@Valid @RequestBody AddImageToBoardRequest addImageToBoardRequest, Authentication authentication) {
//         Status status = boardService.addImageToBoard(addImageToBoardRequest, authentication.getName());
//         return ResponseEntity.status(status.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(status);
//     }

//     @PostMapping(value = "/quick-save-image", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<Status> quickSaveImage(@Valid @RequestBody QuickSaveImageRequest quickSaveImageRequest, Authentication authentication) {
//         Status status = boardService.quickSaveImage(quickSaveImageRequest, authentication.getName());
//         return ResponseEntity.status(status.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(status);
//     }




// }
