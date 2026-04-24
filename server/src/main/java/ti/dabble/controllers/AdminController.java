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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ti.dabble.dtos.ImageResponseForAdminDto;
import ti.dabble.dtos.UserSubscriptionResponseDto;
import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.dtos.WalletResponseForAdminDto;
import ti.dabble.dtos.WalletTransactionResponseForAdminDto;
import ti.dabble.entities.User;
import ti.dabble.requests.AdminUpdateInfoUserRequest;
import ti.dabble.requests.CreateUserRequest;
import ti.dabble.requests.PaginationRequest;
import ti.dabble.requests.UpdateAvatarUserRequest;
import ti.dabble.requests.UpdateRoleUserRequest;
import ti.dabble.requests.UpdateWarningUserRequest;
import ti.dabble.requests.UploadImageForAdminRequest;
import ti.dabble.requests.query.QueryUserSubscriptionRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.admin.IAdminService;
import ti.dabble.services.category.ICategoryService;
import ti.dabble.services.image.IImageService;
import ti.dabble.services.payment.IPaymentService;
import ti.dabble.services.user.IUserService;

@RestController
@RequestMapping("/api/admin")
class AdminController {
    @Autowired
    private IAdminService adminService;
    @Autowired
    private ICategoryService categoryService;
    @Autowired
    private IImageService imageService;
    @Autowired
    private IPaymentService paymentService;
    @Autowired
    private IUserService userService;

    @GetMapping(value = "/total-categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> totalCategories() {
        StatusObject<Integer> status = categoryService.countCategories();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/total-images", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> totalImages() {
        StatusObject<Integer> status = imageService.countImages();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/total-payments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> totalPayments() {
        StatusObject<Integer> status = paymentService.countPayments();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/total-users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> totalUsers() {
        StatusObject<Integer> status = userService.countUsers();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PostMapping(
            value = "/create",
            consumes = MediaType.APPLICATION_JSON_VALUE, // 1. Đầu vào
            produces = MediaType.APPLICATION_JSON_VALUE  // 2. Đầu ra
    )
    public ResponseEntity<StatusObject<User>> createUser(@Valid @RequestBody CreateUserRequest createUserRequest, Authentication authentication) {
        StatusObject<User> status = adminService.createUser(createUserRequest, authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(
            value = "/update-role/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Status> updateRole(@PathVariable("id") String userId, @Valid @RequestBody UpdateRoleUserRequest updateRoleUserRequest, Authentication authentication) {
        Status status = adminService.updateRole(updateRoleUserRequest, userId, authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @DeleteMapping(value = "delete-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteUser(@PathVariable("userId") String userId, Authentication authentication) {
        Status status = adminService.deleteUser(userId, authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(value = "/update-user-by-id/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<User>> updateUser(@Valid @RequestBody AdminUpdateInfoUserRequest adminUpdateInfoUserRequest, @PathVariable("userId") String userId, Authentication authentication) {
        StatusObject<User> statusObject = adminService.updateInfoUser(adminUpdateInfoUserRequest, userId, authentication.getName());
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PutMapping(value = "/update-warning/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<User>> updateWarningUser(@Valid @RequestBody
                                                                UpdateWarningUserRequest updateWarningUserRequest, @PathVariable("userId") String userId) {
        StatusObject<User> statusObject = adminService.updateWarningUser(updateWarningUserRequest, userId);
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PutMapping(value = "/update-avatar/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<User>> updateAvatarUser(@Valid @ModelAttribute
                                                               UpdateAvatarUserRequest updateAvatarUser, @PathVariable("userId") String userId) {
        StatusObject<User> statusObject = adminService.updateAvatarUser(updateAvatarUser, userId);
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-all-images-by-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getAllImagesOfUser(@PathVariable("userId") String userId, @ModelAttribute PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getAllImagesOfUser(userId, paginationRequest);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @DeleteMapping(value = "/delete-image/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteImage(@PathVariable("id") String id) {
        Status status = adminService.deleteImage(id);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/get-all-deleted-images", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getAllDeletedImages() {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getAllDeletedImages();
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-all-deleted-images-by-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getAllDeletedImagesOfUser(@PathVariable("userId") String userId) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getAllDeletedImagesOfUser(userId);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-images-by-category/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getImageByCategoryId(@PathVariable("categoryId") String categoryId, @ModelAttribute PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getImagesByCategory(categoryId, paginationRequest);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-images-by-board/{userId}/{boardId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getImageByBoardId(@PathVariable("userId") String userId, @PathVariable String boardId, @ModelAttribute PaginationRequest paginationRequest, @Nullable Authentication authentication) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getImagesByBoard(userId, boardId, paginationRequest);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-images-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ImageResponseForAdminDto>> getImageByBoardId(@PathVariable("id") String id) {
        StatusObject<ImageResponseForAdminDto> statusObject = adminService.getImageById(id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-all-images", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ImageResponseForAdminDto>>> getAllImages(@ModelAttribute PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = adminService.getAllImages(paginationRequest);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StatusObject<ImageResponseForAdminDto>> upload(@Valid @ModelAttribute
                                                                         UploadImageForAdminRequest uploadImageRequest, Authentication authentication
    ) {
        StatusObject<ImageResponseForAdminDto> statusObject = adminService.saveImage(uploadImageRequest,
                authentication.getName());
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "search-subscriptions-by-user/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<UserSubscriptionResponseDto>>> searchSubscriptions(@PathVariable("id") String id, @ModelAttribute
                                                                                               QueryUserSubscriptionRequest query, PaginationRequest paginationRequest
    ) {
        StatusObject<List<UserSubscriptionResponseDto>> statusObject = adminService.searchSubscriptionsByUser(query, paginationRequest, id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/get-wallet-transaction-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<WalletTransactionResponseForAdminDto>> getWalletTransaction(@PathVariable("id") String id) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = adminService.findWalletTransactionById(id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-wallet-transaction-by-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<WalletTransactionResponseForAdminDto>> getWalletTransactionByUser(@PathVariable("userId") String userId) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = adminService.findWalletTransactionsByUser(userId);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-wallet-transaction-by-reference-id/{referenceId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<WalletTransactionResponseForAdminDto>> getWalletTranactionByReferenceId(@PathVariable("referenceId") String referenceId) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = adminService.findWalletTransactionsByReferenceId(referenceId);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @GetMapping(value = "/get-wallet-by-id/{id}")
    public ResponseEntity<StatusObject<WalletResponseForAdminDto>> getWalletById(@PathVariable("id") String id) {
        StatusObject<WalletResponseForAdminDto> statusObject = adminService.findWalletById(id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }
}