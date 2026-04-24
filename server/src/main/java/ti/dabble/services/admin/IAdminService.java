package ti.dabble.services.admin;

import java.util.List;

import ti.dabble.dtos.*;
import ti.dabble.entities.User;
import ti.dabble.requests.*;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IAdminService {
    StatusObject<User> createUser(
            CreateUserRequest createUserRequest,
            String adminEmail
    );

    Status updateRole(
            UpdateRoleUserRequest updateRoleUserRequest,
            String userId,
            String adminEmail
    );

    Status deleteUser(
            String userId,
            String adminEmail
    );

    StatusObject<User> updateInfoUser(
            AdminUpdateInfoUserRequest adminUpdateInfoUserRequest,
            String userId,
            String adminEmail
    );

    StatusObject<User> updateWarningUser(
            UpdateWarningUserRequest updateWarningUserRequest,
            String userId
    );

    StatusObject<User> updateAvatarUser(
            UpdateAvatarUserRequest updateAvatarUserRequest,
            String userId
    );
    StatusObject<List<ImageResponseForAdminDto>> getAllDeletedImages();
    StatusObject<List<ImageResponseForAdminDto>> getAllDeletedImagesOfUser(String userId);
    StatusObject<List<ImageResponseForAdminDto>> getAllImagesOfUser(String userId, PaginationRequest paginationRequest);

    StatusObject<List<ImageResponseForAdminDto>> getImagesByBoard(
            String userId,
            String boardId,
            PaginationRequest paginationRequest
    );

    StatusObject<List<ImageResponseForAdminDto>> getImagesByCategory(
            String categoryId,
            PaginationRequest paginationRequest
    );

    StatusObject<ImageResponseForAdminDto> getImageById(String id);

    Status deleteImage(String id);

    StatusObject<List<ImageResponseForAdminDto>> getAllImages(PaginationRequest paginationRequest);

    StatusObject<ImageResponseForAdminDto> saveImage(
            UploadImageForAdminRequest imageRequest,
            String userEmail
    );
    StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionsByReferenceId(String referenceId);
    StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionById(String id);
    StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionsByUser(String userId);
    StatusObject<List<UserSubscriptionResponseDto>> searchSubscriptionsByUser(QueryUserSubscriptionRequest query, PaginationRequest paginationRequest, String id);
StatusObject<WalletResponseForAdminDto> findWalletById(String id);

}