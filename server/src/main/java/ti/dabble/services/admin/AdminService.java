package ti.dabble.services.admin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.dtos.ImageMetadata;
import ti.dabble.dtos.ImageResponseForAdminDto;
import ti.dabble.dtos.ImageUrl;
import ti.dabble.dtos.UserSubscriptionResponseDto;
import ti.dabble.dtos.UserSummaryForAdminDto;
import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.dtos.WalletResponseForAdminDto;
import ti.dabble.dtos.WalletTransactionResponseForAdminDto;
import ti.dabble.dtos.WalletTransactionResponseDto;
import ti.dabble.entities.Board;
import ti.dabble.entities.Category;
import ti.dabble.entities.Contact;
import ti.dabble.entities.Image;
import ti.dabble.entities.Wallet;
import ti.dabble.entities.ImageCategory;
import ti.dabble.entities.User;
import ti.dabble.entities.UserSubscription;
import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.ImageType;
import ti.dabble.enums.Role;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.BoardRepository;
import ti.dabble.repositories.CategoryRepository;
import ti.dabble.repositories.CommentRepository;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.ImageCategoryRepository;
import ti.dabble.repositories.ImageRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.repositories.WalletRepository;
import ti.dabble.repositories.WalletTransactionRepository;
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
import ti.dabble.services.image.IImageService;
import ti.dabble.services.user_subscription.UserSubscriptionService;
import ti.dabble.specifications.UserSubscriptionSpecification;

@Service
public class AdminService implements IAdminService {
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private UserSubscriptionService userSubscriptionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private IImageService imageService;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Value("${avatar-url}")
    private String avatarUrl;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private ImageCategoryRepository imageCategoryRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Transactional
    @Override
    public StatusObject<User> createUser(
            CreateUserRequest createUserRequest,
            String adminEmail) {
        StatusObject<User> statusObject = new StatusObject<>(false, "", "", null);
        User admin = userRepository.findByEmail(adminEmail);
        if (admin == null) {
            statusObject.errorMessage = "Admin not found";
            return statusObject;
        }

        if (!hasCreationPermission(admin, createUserRequest.getRoleId())) {
            statusObject.errorMessage = "You don't have permission to create this user role";
            return statusObject;
        }

        if (userRepository.existsByPhone(createUserRequest.getPhone())) {
            statusObject.errorMessage = "Phone already exists";
            return statusObject;
        }
        if (userRepository.existsByEmail(createUserRequest.getEmail())) {
            statusObject.errorMessage = "Email already exists";
            return statusObject;
        }
        if (userRepository.existsByUsername(createUserRequest.getUsername())) {
            statusObject.errorMessage = "Username already exists";
            return statusObject;
        }

        User user = new User();
        user.setUsername(createUserRequest.getUsername());
        user.setFirstname(createUserRequest.getFirstName());
        user.setLastname(createUserRequest.getLastName());
        user.setEmail(createUserRequest.getEmail());
        user.setPhone(createUserRequest.getPhone());
        user.setDateOfBirth(createUserRequest.getDateOfBirth());
        user.setAvatar(avatarUrl + createUserRequest.getFirstName() + "+" + createUserRequest.getLastName());
        user.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));
        user.setActive(true);
        user.setPublic(false);
        user.setRoleId(String.valueOf(createUserRequest.getRoleId()));

        userRepository.save(user);
        statusObject.setSuccess(true);
        statusObject.setMessage("User created successfully");
        statusObject.setData(user);

        return statusObject;
    }

    @Override
    public Status updateRole(
            UpdateRoleUserRequest updateRoleUserRequest,
            String userId,
            String adminEmail) {
        Status status = new Status(false, "", "");
        User admin = userRepository.findByEmail(adminEmail);
        if (admin == null) {
            status.message = "Admin not found";
            return status;
        }
        User user = userRepository.findUserById(UUID.fromString(userId));
        if (user == null) {
            status.message = "User not found";
            return status;
        }
        if (!hasCreationPermission(admin, updateRoleUserRequest.getRoleId())) {
            status.message = "You don't have permission to update this user role";
            return status;
        }

        if (admin.getRoleId()
                .equalsIgnoreCase(String.valueOf(Role.ADMIN.getId()))) {
            if (user.getRoleId()
                    .equalsIgnoreCase(String.valueOf(Role.ADMIN.getId()))) {
                status.message = "You don't have permission to update this user role";
                return status;
            }
        }
        user.setRoleId(updateRoleUserRequest.getRoleId());
        userRepository.save(user);
        status.setIsSuccess(true);
        status.setMessage("User role updated successfully");
        return status;
    }

    @Override
    public Status deleteUser(
            String userId,
            String adminEmail) {

        Status status = new Status(false, "", "");
        User admin = userRepository.findByEmail(adminEmail);
        if (admin == null) {
            status.message = "Admin not found";
            return status;
        }
        if (!admin.getRoleId()
                .equalsIgnoreCase(String.valueOf(Role.SUPERADMIN.getId()))) {
            status.message = "You don't have permission to delete this user";
            return status;
        }
        User user = userRepository.findUserById(UUID.fromString(userId));
        if (user == null) {
            status.message = "User not found";
            return status;
        }
        List<Contact> contactsOfUser = contactRepository.findAllContactOfUser(UUID.fromString(userId));
        contactRepository.deleteAll(contactsOfUser);
        user.setDeleted(true);
        userRepository.save(user);
        status.setIsSuccess(true);
        status.setMessage("Deleted user successfully");
        return status;
    }

    @Override
    public StatusObject<User> updateInfoUser(
            AdminUpdateInfoUserRequest adminUpdateInfoUserRequest,
            String userId,
            String adminEmail) {
        StatusObject<User> statusObject = new StatusObject<>(false, "", "", null);

        User admin = userRepository.findByEmail(adminEmail);
        if (admin == null) {
            statusObject.setErrorMessage("Admin not found");
            return statusObject;
        }
        User user = userRepository.findUserById(UUID.fromString(userId));
        if (user == null) {
            statusObject.message = "User not found";
            return statusObject;
        }
        if (!admin.getRoleId()
                .equalsIgnoreCase(String.valueOf(Role.SUPERADMIN.getId()))) {
            statusObject.setErrorMessage("You don't have permission to delete this user");
            return statusObject;
        }
        if (userRepository.existsByPhone(adminUpdateInfoUserRequest.getPhone()) && !user.getPhone()
                .equalsIgnoreCase(adminUpdateInfoUserRequest.getPhone())) {
            statusObject.errorMessage = "Phone already exists";
            return statusObject;
        }
        if (userRepository.existsByUsername(adminUpdateInfoUserRequest.getUsername()) && !user.getUsername()
                .equalsIgnoreCase(adminUpdateInfoUserRequest.getUsername())) {
            statusObject.errorMessage = "Username already exists";
            return statusObject;
        }
        user.setUsername(adminUpdateInfoUserRequest.getUsername());
        user.setFirstname(adminUpdateInfoUserRequest.getFirstName());
        user.setLastname(adminUpdateInfoUserRequest.getLastName());
        user.setPhone(adminUpdateInfoUserRequest.getPhone());
        user.setDateOfBirth(adminUpdateInfoUserRequest.getDateOfBirth());
        User savedUser = userRepository.save(user);
        statusObject.setSuccess(true);
        statusObject.setMessage("User updated successfully");
        statusObject.setData(savedUser);
        return statusObject;
    }

    @Override
    public StatusObject<User> updateWarningUser(
            UpdateWarningUserRequest updateWarningUserRequest,
            String userId) {
        StatusObject<User> statusObject = new StatusObject<>(false, "", "", null);

        User user = userRepository.findUserById(UUID.fromString(userId));
        if (user == null) {
            statusObject.message = "User not found";
            return statusObject;
        }
        user.setWarning(updateWarningUserRequest.getWarning());
        User savedUser = userRepository.save(user);
        statusObject.setSuccess(true);
        statusObject.setMessage("User updated successfully");
        statusObject.setData(savedUser);
        return statusObject;
    }

    @Override
    public StatusObject<User> updateAvatarUser(
            UpdateAvatarUserRequest updateAvatarUserRequest,
            String userId) {
        StatusObject<User> statusObject = new StatusObject<>(false, "", "", null);
        User user = userRepository.findUserById(UUID.fromString(userId));
        if (user == null) {
            statusObject.setMessage("User not found");
            return statusObject;
        }
        MultipartFile file = updateAvatarUserRequest.getFile();
        if (file != null && !file.isEmpty()) {
            StatusObject<ImageMetadata> uploadStatus = imageService.uploadImage(file, ImageType.AVATARS);
            if (uploadStatus.isSuccess && uploadStatus.getData() != null) {
                user.setAvatar(uploadStatus.getData()
                        .getFileName());
            } else {
                statusObject.errorMessage = "Image upload failed: " + uploadStatus.errorMessage;
                return statusObject;
            }
        }
        User savedUser = userRepository.save(user);
        savedUser.setAvatar(FileHelper.getAvatarUrl(cloudinary, savedUser.getAvatar()));
        statusObject.setSuccess(true);
        statusObject.setMessage("User updated successfully");
        statusObject.setData(savedUser);
        return statusObject;

    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getAllImagesOfUser(
            String userId,
            PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User creator = userRepository.findUserById(UUID.fromString(userId));
            if (creator == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Pageable pageable = PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize());

            Page<Image> images = imageRepository.findAllByCreatorId(UUID.fromString(userId), pageable);
            if (images.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseForAdminDto> ImageResponseForAdminDtos = images.getContent()
                    .stream()
                    .map((i) -> getImageResponseForAdminDto(i.getCreator(), i))
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(ImageResponseForAdminDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public Status deleteImage(String id) {
        Status status = new Status(false, "", "");
        Image image = imageRepository.findImageById(UUID.fromString(id));
        if (image == null) {
            status.setErrorMessage("Image not found");
            return status;
        }
        List<ImageCategory> imageCategories = imageCategoryRepository.findImageCategoriesByImageId(image.getId());
        if (!imageCategories.isEmpty()) {
            imageCategoryRepository.deleteAll(imageCategories);
        }
        image.setDeleted(true);
        imageRepository.save(image);
        status.setIsSuccess(true);
        status.setMessage("Delete image successfully");
        return status;
    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getImagesByBoard(
            String userId,
            String boardId,
            PaginationRequest paginationRequest) {

        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User creator = userRepository.findUserById(UUID.fromString(userId));
            if (creator == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Board board = boardRepository.findBoardById(boardId);
            if (board == null) {
                statusObject.setErrorMessage("Board not found");
                return statusObject;
            }
            if (!board.getUser()
                    .getId().toString()
                    .equalsIgnoreCase(creator.getId().toString())) {
                statusObject.setErrorMessage("User are not the owner of this board");
                return statusObject;
            }

            Pageable pageable = PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize());
            Page<Image> pageResult = imageRepository.findImagesByBoardIdByAdmin(boardId, pageable);

            if (pageResult == null || pageResult.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseForAdminDto> ImageResponseForAdminDtos = pageResult.getContent()
                    .stream()
                    .map((i) -> getImageResponseForAdminDto(i.getCreator(), i))
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(ImageResponseForAdminDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getImagesByCategory(
            String categoryId,
            PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Pageable pageable = PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize());
            Page<Image> pageResult = imageRepository.findImagesByCategoryIdByAdmin(UUID.fromString(categoryId),
                    pageable);
            List<ImageResponseForAdminDto> ImageResponseForAdminDtos = pageResult.getContent()
                    .stream()
                    .map(image -> getImageResponseForAdminDto(image.getCreator(), image))
                    .toList();
            if (ImageResponseForAdminDtos.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No more images to load");
                return statusObject;
            }
            statusObject.setSuccess(true);
            statusObject.setMessage("Get images successfully");
            statusObject.setData(ImageResponseForAdminDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getAllImages(PaginationRequest paginationRequest) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Pageable pageable = PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize());
            ;
            Page<Image> pageResult = imageRepository.findAllImages(pageable);
            if (pageResult.getContent()
                    .isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }
            List<ImageResponseForAdminDto> imageResponseDtos = pageResult.getContent()
                    .stream()
                    .map(i -> getImageResponseForAdminDto(i.getCreator(), i))
                    .toList();

            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(imageResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<ImageResponseForAdminDto> getImageById(String id) {
        StatusObject<ImageResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Image image = imageRepository.findById(UUID.fromString(id)).orElse(null);
            if (image == null) {
                statusObject.setErrorMessage("Image not found");
                return statusObject;
            }
            User creator = image.getCreator();
            ImageResponseForAdminDto imageDetailsResponseDto = getImageResponseForAdminDto(creator, image);
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(imageDetailsResponseDto);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public StatusObject<ImageResponseForAdminDto> saveImage(
            UploadImageForAdminRequest imageRequest,
            String userEmail) {
        StatusObject<ImageResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        User creator = userRepository.findByEmail(userEmail);
        if (creator == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }

        StatusObject<ImageMetadata> uploadImageStatus = imageService.uploadImage(imageRequest.getFile(),
                ImageType.IMAGES);
        if (!uploadImageStatus.isSuccess()) {
            statusObject.setErrorMessage(uploadImageStatus.getErrorMessage());
            return statusObject;
        }
        if (uploadImageStatus.getData() == null) {
            statusObject.setErrorMessage("Upload image failed");
            return statusObject;
        }
        ImageMetadata originalImage = uploadImageStatus.getData();
        Image newImage = new Image();
        newImage.setDescription(imageRequest.getDescription());
        newImage.setCreator(creator);
        newImage.setImageUrl(originalImage.getFileName());
        newImage.setPrice(BigDecimal.ZERO);
        newImage.setWidth(originalImage.getWidth());
        newImage.setHeight(originalImage.getHeight());
        newImage.setFileSize(originalImage.getFileSize());
        List<UUID> categoryIds = imageRequest.getCategoryIds().stream()
                .map(UUID::fromString)
                .toList();
        List<Category> categories = categoryRepository.findCategoriesByIds(categoryIds);
        List<ImageCategory> imageCategories = new ArrayList<>();
        for (Category category : categories) {
            ImageCategory imageCategory = new ImageCategory();
            imageCategory.setImage(newImage);
            imageCategory.setCategory(category);

            imageCategories.add(imageCategory);
        }

        ImageResponseForAdminDto imageResponseDto = getImageResponseForAdminDto(creator, newImage);
        imageRepository.save(newImage);
        imageCategoryRepository.saveAll(imageCategories);
        statusObject.setSuccess(true);
        statusObject.setMessage("Upload image successfully");
        statusObject.setData(imageResponseDto);
        return statusObject;
    }

    @Override
    public StatusObject<List<UserSubscriptionResponseDto>> searchSubscriptionsByUser(
            QueryUserSubscriptionRequest query,
            PaginationRequest paginationRequest,
            String id) {
        StatusObject<List<UserSubscriptionResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findUserById(UUID.fromString(id));
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Pageable pageable = userSubscriptionService.buildPageable(
                    query,
                    paginationRequest.getPage(),
                    paginationRequest.getSize());
            Page<UserSubscription> userSubscriptions = userSubscriptionRepository.findAll(
                    UserSubscriptionSpecification.filter(query, user.getEmail()), pageable);
            List<UserSubscriptionResponseDto> userSubscriptionResponseDtos = userSubscriptions.getContent()
                    .stream()
                    .map(FileMapper::getUserSubscriptionResponseDto)
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get subscription of user successfully");
            statusObject.setData(userSubscriptionResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getAllDeletedImages() {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<Image> images = imageRepository.findAllDeletedImages();
            if (images.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }
            List<ImageResponseForAdminDto> imageResponseDtos = images.stream()
                    .map(i -> getImageResponseForAdminDto(i.getCreator(), i))
                    .toList();

            statusObject.setSuccess(true);
            statusObject.setMessage("Get all deleted images successfully");
            statusObject.setData(imageResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ImageResponseForAdminDto>> getAllDeletedImagesOfUser(
            String userId) {
        StatusObject<List<ImageResponseForAdminDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User creator = userRepository.findUserById(UUID.fromString(userId));
            if (creator == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            List<Image> images = imageRepository.findAllDeletedImagesOfUser(UUID.fromString(userId));
            if (images.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseForAdminDto> imageResponseForAdminDtos = images.stream()
                    .map(i -> getImageResponseForAdminDto(creator, i))
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(imageResponseForAdminDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionById(String id) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            WalletTransaction walletTransaction = walletTransactionRepository.findById(UUID.fromString(id))
                    .orElse(null);
            if (walletTransaction == null) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                WalletTransactionResponseDto walletTransactionResponseDto = FileMapper
                        .getWalletTransactionResponseDto(walletTransaction);
                WalletTransactionResponseForAdminDto walletTransactionResponseForAdminDto = new WalletTransactionResponseForAdminDto(walletTransaction.getWallet().getId().toString(), List.of(walletTransactionResponseDto));
                statusObject.setData(walletTransactionResponseForAdminDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionsByUser(String userId) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findUserById(UUID.fromString(userId));
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            List<WalletTransaction> walletTransactions = walletTransactionRepository
                    .findWalletTransactionByUser(user.getId());
            if (walletTransactions.isEmpty()) {
                statusObject.setMessage("No payment found");
            } else {
                statusObject.setMessage("Get payments successfully");
                List<WalletTransactionResponseDto> walletTransactionResponseDtos = walletTransactions.stream().map(
                        FileMapper::getWalletTransactionResponseDto).toList();
                WalletTransactionResponseForAdminDto walletTransactionResponseForAdminDto = new WalletTransactionResponseForAdminDto(
                        walletTransactions.get(0).getWallet().getId().toString(), walletTransactionResponseDtos);
                statusObject.setData(walletTransactionResponseForAdminDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<WalletTransactionResponseForAdminDto> findWalletTransactionsByReferenceId(String referenceId) {
        StatusObject<WalletTransactionResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<WalletTransaction> walletTransactions = walletTransactionRepository
                    .findWalletTransactionByReferenceId(UUID.fromString(referenceId));
            if (walletTransactions == null) {
                statusObject.setMessage("No payment found");
            } else {
                List<WalletTransactionResponseDto> walletTransactionResponseDtos = walletTransactions.stream()
                        .map(
                                FileMapper::getWalletTransactionResponseDto)
                        .toList();

                WalletTransactionResponseForAdminDto walletTransactionResponseForAdminDto = new WalletTransactionResponseForAdminDto(
                        walletTransactions.get(0).getWallet().getId().toString(), walletTransactionResponseDtos);
                statusObject.setMessage("Get payments successfully");
                statusObject.setData(walletTransactionResponseForAdminDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    public ImageResponseForAdminDto getImageResponseForAdminDto(
            User creator,
            Image image) {
        int commentCount = (int) commentRepository.countCommentByImageId(image.getId());
        List<CategoryResponseDto> categoryResponseDtos;
        List<ImageCategory> imageCategories = imageCategoryRepository.findImageCategoriesByImageId(image.getId());
        categoryResponseDtos = imageCategories.stream()
                .map(
                        (ic) -> FileMapper.getCategoryResponseDto(ic.getCategory()))
                .toList();
        UserSummaryForAdminDto creatorDto = UserSummaryForAdminDto.builder()
                .id(creator.getId().toString())
                .username(creator.getUsername())
                .email(creator.getEmail())
                .avatar(FileHelper.getAvatarUrl(cloudinary, creator.getAvatar()))
                .name(creator.getFirstname() + " " + creator.getLastname())
                .build();

        ImageMetadata imageMetadata = new ImageMetadata(
                image.getImageUrl(), image.getWidth(), image.getHeight(),
                image.getFileSize());
        ImageUrl imageUrls = imageService.setUrlImages(imageMetadata);
        return ImageResponseForAdminDto.builder()
                .id(image.getId().toString())
                .creator(creatorDto)
                .imageUrls(imageUrls)
                .width(image.getWidth())
                .height(image.getHeight())
                .price(image.getPrice())
                .categories(categoryResponseDtos)
                .isPublic(image.isPublic())
                .filesize(image.getFileSize())
                .description(image.getDescription())
                .likeCount(image.getLikeCount())
                .commentCount(commentCount)
                .createdDate(image.getCreatedDate())
                .build();
    }

    private boolean hasCreationPermission(
            User admin,
            String roleOfRequest) {

        return switch (admin.getRoleId()) {
            case "1" -> !(String.valueOf(Role.SUPERADMIN.getId())
                    .equals(roleOfRequest));
            case "2" ->
                // ADMIN không được phép tạo role có id là 1 (SUPERADMIN) hoặc 2 (ADMIN)
                !(String.valueOf(Role.SUPERADMIN.getId())
                        .equals(roleOfRequest)
                        || String.valueOf(Role.ADMIN.getId())
                                .equals(roleOfRequest));
            default -> false;
        };
    }

    @Override
    public StatusObject<WalletResponseForAdminDto> findWalletById(String id) {
        StatusObject<WalletResponseForAdminDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            
            Wallet wallet = walletRepository.findById(UUID.fromString(id)).orElse(null);
            if (wallet == null) {
                statusObject.setMessage("Wallet not found");
            } else {
                statusObject.setMessage("Get wallet successfully");
                WalletResponseForAdminDto walletResponseDto = FileMapper.getWalletResponseForAdminDto(wallet);
                statusObject.setData(walletResponseDto);
            }
            statusObject.setSuccess(true);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }
}
