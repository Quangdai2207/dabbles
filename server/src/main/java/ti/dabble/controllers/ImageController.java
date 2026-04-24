package ti.dabble.controllers;

import java.util.List;

import javax.annotation.Nullable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ti.dabble.annotations.RateLimit;
import ti.dabble.dtos.CommentCountDto;
import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.dtos.ImageDetailsResponseDto;
import ti.dabble.dtos.ImageResponseAndPaginationDto;
import ti.dabble.dtos.LikeResponseDto;
import ti.dabble.requests.CreateCommentRequest;
import ti.dabble.requests.CreateLikeImageRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.UpdateImageRequest;
import ti.dabble.requests.UploadImageRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.comment.ICommentService;
import ti.dabble.services.image.IImageService;

@RestController
@RequestMapping("/api/image")
class ImageController {
    @Autowired
    private IImageService imageService;
    @Autowired
    private ICommentService commentService;


    @GetMapping(value = "/get-all-images-by-user/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageResponseAndPaginationDto>> getAllImagesOfUser(
            @PathVariable("username") String username,
            @ModelAttribute PaginationRequestForClient paginationRequestForClient,
            @Nullable Authentication authentication) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<ImageResponseAndPaginationDto> statusObject = imageService.getAllImagesOfUser(username,
                paginationRequestForClient, authEmail);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-all-like-images-by-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageResponseAndPaginationDto>> getAllLikeImagesOfUser(
            Authentication authentication,
            @ModelAttribute PaginationRequestForClient paginationRequestForClient) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = imageService
                .getAllLikeImagesOfUser(authentication.getName(), paginationRequestForClient);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-image-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageDetailsResponseDto>> getImageById(@PathVariable("id") String id,
                                                                              @Nullable Authentication authentication) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<ImageDetailsResponseDto> statusObject = imageService.getImageById(id, authEmail);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-all-purchased-images", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageResponseAndPaginationDto>> getAllPurchasedImagesOfUser(
            Authentication authentication,
            @ModelAttribute PaginationRequestForClient paginationRequestForClient) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = imageService
                .getAllPurchasedImagesOfUser(authentication.getName(), paginationRequestForClient);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    // @GetMapping(value = "/get-images-by-board/{userId}/{boardId}", produces =
    // MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<StatusObject<List<ImageResponseDto>>>
    // getImageByBoardId(@PathVariable String userId, @PathVariable String boardId,
    // @ModelAttribute PaginationRequestForClient PaginationRequestForClient,
    // @Nullable Authentication authentication) {
    // String authEmail = authentication == null ? null : authentication.getName();
    // StatusObject<List<ImageResponseDto>> statusObject =
    // imageService.getImagesByBoard(userId, boardId, PaginationRequestForClient,
    // authEmail);
    // return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK :
    // HttpStatus.BAD_REQUEST)
    // .body(statusObject);
    // }
    @RateLimit(limit = 10, window = 10)
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Status> upload(@Valid @ModelAttribute UploadImageRequest uploadImageRequest,
                                         Authentication authentication) {
        Status status = imageService.saveImage(uploadImageRequest,
                authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @RateLimit(limit = 10, window = 10)
    @PutMapping(value = "/update/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> update(@PathVariable("id") String id,
                                         @Valid @RequestBody UpdateImageRequest updateImageRequest, Authentication authentication) {
        Status status = imageService.updateImage(id, updateImageRequest,
                authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @DeleteMapping(value = "/delete-image/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteImage(@PathVariable("id") String id, Authentication authentication) {
        Status status = imageService.deleteImage(id, authentication.getName());
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/get-images-for-home-page", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageResponseAndPaginationDto>> getImagesForHomePage(
            @Nullable Authentication authentication,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "keyword", required = false) String keyword,
            @ModelAttribute PaginationRequestForClient paginationRequestForClient) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<ImageResponseAndPaginationDto> statusObject = imageService.getImagesForUserHomePage(
                authEmail,
                category, keyword, paginationRequestForClient);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }


    @RateLimit(limit = 5, window = 10)
    @PostMapping(value = "/comment", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<CommentCountDto>> createComment(
            @Valid @RequestBody CreateCommentRequest createCommentRequest, Authentication authentication) {
        StatusObject<CommentCountDto> statusObject = imageService.comment(createCommentRequest,
                authentication.getName());
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-comments-by-image/{imageId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<CommentResponseDto>>> getCommentsByImage(@PathVariable("imageId") String imageId) {
        StatusObject<List<CommentResponseDto>> statusObject = commentService.getCommentsByImageId(imageId);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @RateLimit(limit = 10, window = 10)
    @PostMapping("/like")
    public ResponseEntity<StatusObject<LikeResponseDto>> likeImage(
            @Valid @RequestBody CreateLikeImageRequest createLikeImageRequest,
            Authentication authentication) {
        StatusObject<LikeResponseDto> statusObject = imageService.like(createLikeImageRequest,
                authentication.getName());
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

}
