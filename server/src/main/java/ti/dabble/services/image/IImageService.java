package ti.dabble.services.image;

import java.util.List;

import javax.annotation.Nullable;

import org.springframework.web.multipart.MultipartFile;

import ti.dabble.dtos.CommentCountDto;
import ti.dabble.dtos.ImageDetailsResponseDto;
import ti.dabble.dtos.ImageMetadata;
import ti.dabble.dtos.ImageResponseAndPaginationDto;
import ti.dabble.dtos.ImageResponseDto;
import ti.dabble.dtos.ImageUrl;
import ti.dabble.dtos.LikeResponseDto;
import ti.dabble.entities.Image;
import ti.dabble.entities.User;
import ti.dabble.enums.ImageType;
import ti.dabble.requests.CreateCommentRequest;
import ti.dabble.requests.CreateLikeImageRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.UpdateImageRequest;
import ti.dabble.requests.UploadImageRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IImageService {
    StatusObject<Integer> countImages();

    StatusObject<ImageMetadata> uploadImage(MultipartFile file, ImageType imageType);

    Status saveImage(UploadImageRequest imageRequest, String userEmail);

    Status updateImage(String imageId, UpdateImageRequest updateImageRequest, String userEmail);

    StatusObject<ImageResponseAndPaginationDto> getAllImagesOfUser(String username,
                                                                   PaginationRequestForClient paginationForClient, @Nullable String authEmail);

    StatusObject<ImageDetailsResponseDto> getImageById(String id, @Nullable String authEmail);

    Status deleteImage(String id, String email);

    StatusObject<ImageResponseAndPaginationDto> getImagesForUserHomePage(@Nullable String authEmail,
                                                                         @Nullable String categorySlug, @Nullable String keyword, PaginationRequestForClient paginationForClient);


    ImageResponseDto getImageResponseDto(
            User creator,
            Image image,
            boolean isLiked);

    StatusObject<CommentCountDto> comment(
            CreateCommentRequest createCommentRequest,
            String senderEmail);

    ImageUrl setUrlImages(ImageMetadata originalImage);

    // StatusObject<List<ImageResponseDto>> getImagesByBoard(String username, String
    // boardId, PaginationRequestForClient paginationForClient, @Nullable String
    // authEmail);
    StatusObject<ImageResponseAndPaginationDto> getAllLikeImagesOfUser(String userEmail,
                                                                       PaginationRequestForClient paginationForClient);

    StatusObject<LikeResponseDto> like(CreateLikeImageRequest createLikeImageRequest, String userEmail);

    StatusObject<ImageResponseAndPaginationDto> getAllPurchasedImagesOfUser(String userEmail,
                                                                            PaginationRequestForClient paginationForClient);
}
