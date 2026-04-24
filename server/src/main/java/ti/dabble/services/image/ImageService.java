package ti.dabble.services.image;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Nullable;
import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.dtos.CommentCountDto;
import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.dtos.ImageDetailsResponseDto;
import ti.dabble.dtos.ImageMetadata;
import ti.dabble.dtos.ImageResponseAndPaginationDto;
import ti.dabble.dtos.ImageResponseDto;
import ti.dabble.dtos.ImageUrl;
import ti.dabble.dtos.LikeResponseDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.entities.Category;
import ti.dabble.entities.Comment;
import ti.dabble.entities.Image;
import ti.dabble.entities.ImageCategory;
import ti.dabble.entities.LikeImage;
import ti.dabble.entities.Notification;
import ti.dabble.entities.User;
import ti.dabble.enums.ImageType;
import ti.dabble.enums.NotificationType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.CategoryRepository;
import ti.dabble.repositories.CommentRepository;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.ImageCategoryRepository;
import ti.dabble.repositories.ImageRepository;
import ti.dabble.repositories.LikeImageRepository;
import ti.dabble.repositories.NotificationRepository;
import ti.dabble.repositories.UserPurchasedImageRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.requests.CreateCommentRequest;
import ti.dabble.requests.CreateLikeImageRequest;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.requests.UpdateImageRequest;
import ti.dabble.requests.UploadImageRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;

@Service
public class ImageService implements IImageService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageCategoryRepository imageCategoryRepository;
    @Autowired
    private LikeImageRepository likeImageRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    @Autowired
    private UserPurchasedImageRepository userPurchasedImageRepository;
    @Autowired
    private Cloudinary cloudinary;

    private static final String AVATAR_FOLDER = "dabble/avatars";
    private static final String IMAGE_FOLDER = "dabble/images";
    private static final String LOGO_ID = "dabble:avatars:logo";

    @Override
    public StatusObject<ImageMetadata> uploadImage(
            MultipartFile file,
            ImageType imageType) {

        StatusObject<ImageMetadata> statusObject = new StatusObject<>(false, "", "", null);

        try {
            Status isValid = isValidateImageFile(file);
            if (!isValid.isSuccess()) {
                statusObject.setErrorMessage(isValid.getErrorMessage());
                return statusObject;
            }
            String generatedFileName = FileHelper.generateFileNameForImage();

            ImageMetadata generatedFiles;

            if (imageType == ImageType.IMAGES) {
                generatedFiles = uploadImageToCloudinary(file, generatedFileName);
            } else {
                generatedFiles = uploadAvatarToCloudinaryAndResize(file, generatedFileName);
            }

            statusObject.setData(generatedFiles);
            statusObject.setSuccess(true);
            statusObject.setMessage("Upload image to Cloudinary successfully");

            return statusObject;

        } catch (IOException e) {
            statusObject.setErrorMessage("Cloudinary Error: " + e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public Status saveImage(UploadImageRequest imageRequest, String userEmail) {
        // 1. QUAN TRỌNG: Khai báo biến 'status' cục bộ (Local Variable)
        // Nếu để biến toàn cục (Global/Field), khi nhiều user upload cùng lúc sẽ bị
        // xung đột dữ liệu.
        Status status = new Status(false, "", "");

        // 2. Validate User
        User creator = userRepository.findByEmail(userEmail);
        if (creator == null) {
            status.setErrorMessage("User not found");
            return status;
        }

        // 3. Check Subscription & Limit
        LocalDateTime expiredDay = userSubscriptionRepository.getExpiredDayOfUser(creator.getId(), LocalDateTime.now());
        if (expiredDay == null || expiredDay.isBefore(LocalDateTime.now())) {
            int currentImageCount = imageRepository.countByCreatorId(creator.getId()).intValue();
            if (currentImageCount >= 10) {
                status.setErrorMessage(
                        "You have reached the limit of uploading images (10). Please renew your subscription to continue uploading.");
                return status;
            }
        }

        // 4. Gọi hàm uploadImage (Đã chuyển sang Cloudinary)
        // Hàm này bây giờ sẽ upload file lên Cloud và trả về thông tin ảnh gốc
        StatusObject<ImageMetadata> uploadImageStatus = uploadImage(imageRequest.getFile(), ImageType.IMAGES);

        if (!uploadImageStatus.isSuccess()) {
            status.setErrorMessage(uploadImageStatus.getErrorMessage());
            return status;
        }
        if (uploadImageStatus.getData() == null) {
            status.setErrorMessage("Upload image failed: No metadata returned");
            return status;
        }

        // 5. Validate Categories (Logic giữ nguyên)
        int validCategoriesCount = 0;
        List<UUID> categoryIds = imageRequest.getCategoryIds().stream()
                .map(UUID::fromString)
                .toList();
        List<Category> categories = categoryRepository.findCategoriesByIds(categoryIds);

        if (categories.isEmpty()) {
            status.setErrorMessage("Every category that you choose not found, please choose another one");
            return status;
        }
        if (categories.size() < imageRequest.getCategoryIds().size()) {
            validCategoriesCount = imageRequest.getCategoryIds().size() - categories.size();
        }
        // 6. Lấy thông tin ảnh gốc từ Cloudinary response
        ImageMetadata originalImage = uploadImageStatus.getData();
        if (originalImage == null) {
            status.setErrorMessage("Upload image failed: No metadata returned");
            return status;
        }
        // 7. Tạo Entity Image để lưu vào Database
        Image newImage = new Image();
        newImage.setDescription(imageRequest.getDescription());
        newImage.setCreator(creator);

        // --- MAPPING QUAN TRỌNG ---
        // originalImage.getFileName() trả về: "UUID_original.webp"
        // Database lưu: "images/UUID_original.webp"
        // Việc thêm tiền tố "images/" giúp giữ nguyên cấu trúc cũ,
        // để sau này hàm setUrlImages() của bạn vẫn cắt chuỗi hoạt động đúng.
        newImage.setImageUrl(originalImage.getFileName());

        newImage.setPrice(imageRequest.getPrice());
        newImage.setWidth(originalImage.getWidth()); // Lấy width thực tế từ Cloudinary
        newImage.setHeight(originalImage.getHeight()); // Lấy height thực tế từ Cloudinary
        newImage.setFileSize(originalImage.getFileSize());

        // 8. Map Category
        List<ImageCategory> imageCategories = new ArrayList<>();
        for (Category category : categories) {
            ImageCategory imageCategory = new ImageCategory();
            imageCategory.setImage(newImage);
            imageCategory.setCategory(category);
            imageCategories.add(imageCategory);
        }

        // 9. Save DB
        imageRepository.save(newImage);
        imageCategoryRepository.saveAll(imageCategories);

        // 10. Trả về kết quả
        status.setIsSuccess(true);
        if (validCategoriesCount != 0) {
            status.setMessage(
                    "Upload image successfully but there is " + validCategoriesCount + " categories not found.");
        } else {
            status.setMessage("Upload image successfully");
        }
        return status;
    }

    @Override
    public StatusObject<ImageResponseAndPaginationDto> getAllImagesOfUser(
            String username,
            PaginationRequestForClient paginationForClient,
            @Nullable String authEmail) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User creator = userRepository.findByUsername(username);
            if (creator == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            boolean isOwner = false;
            boolean isFollowing = false;
            User authUser;
            Pageable pageable = PageRequest.of(paginationForClient.getPage(), 10);
            Page<Image> pageResult;
            if (authEmail != null) {
                authUser = userRepository.findByEmail(authEmail);
                if (authUser != null && authUser.getId()
                        .equals(creator.getId())) {
                    isOwner = true;
                } else if (authUser != null) {
                    isFollowing = contactRepository.hasFollowUser(authUser.getId(), creator.getId());
                }
            } else {
                authUser = null;
            }
            if (isOwner) {
                pageResult = imageRepository.findAllByCreatorId(creator.getId(), pageable);

            } else {
                if (creator.isPublic()) {
                    pageResult = imageRepository.findByCreatorIdAndIsPublic(creator.getId(), pageable);
                } else {
                    if (isFollowing) {
                        pageResult = imageRepository.findByCreatorIdAndIsPublic(creator.getId(), pageable);
                    } else {
                        pageResult = Page.empty();
                    }
                }
            }
            if (pageResult.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseDto> imageResponseDtos = pageResult.getContent()
                    .stream()
                    .map((i) -> {
                        boolean isLiked = false;
                        if (authUser != null) {
                            isLiked = likeImageRepository.existsLikeImageByUserIdAndImageId(
                                    authUser.getId(),
                                    i.getId());
                        }
                        return getImageResponseDto(i.getCreator(), i, isLiked);

                    })
                    .toList();

            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(new ImageResponseAndPaginationDto(
                    pageResult.getTotalPages() > 0 ? pageResult.getTotalPages() - 1 : 0, imageResponseDtos));
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    private Status isValidateImageFile(MultipartFile file) {
        Status status = new Status(false, "", "");
        int MAX_FILE_SIZE = 1024 * 1024 * 20;
        int MIN_WIDTH = 600;
        int MAX_WIDTH = 8000;
        int MIN_HEIGHT = 300;
        double MAX_ASPECT_RATIO = 3.5;
        long MAX_PIXEL_COUNT = 40_000_000L;
        List<String> allowedTypes = List.of("image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic", "image/heif");
        try {
            if (file == null || file.isEmpty()) {
                status.setErrorMessage("File upload is empty");
                return status;
            }

            if (file.getOriginalFilename() == null) {
                status.setErrorMessage("File name is null");
                return status;
            }
            String contentType = file.getContentType();

            if (contentType != null) {
                if (!allowedTypes.contains(contentType)) {
                    status.setErrorMessage("Unsupported image format (jpeg, png, jpg, webp, heic, heif");
                    return status;
                }
                BufferedImage image = ImageIO.read(file.getInputStream());
                if (image == null) {
                    status.setErrorMessage("Invalid image file");
                    return status;
                }
                if (image.getWidth() > MAX_WIDTH) {
                    status.setErrorMessage("Width is too large");
                    return status;
                }
                if (image.getWidth() < MIN_WIDTH) {
                    status.setErrorMessage("Width is too small");
                    return status;
                }
                if (image.getHeight() < MIN_HEIGHT) {
                    status.setErrorMessage("Height is too small");
                    return status;
                }
                if (file.getSize() > MAX_FILE_SIZE) {
                    status.setErrorMessage("File size is too large");
                    return status;
                }
                long pixelCount = (long) image.getWidth() * image.getHeight();
                if (pixelCount > MAX_PIXEL_COUNT) {
                    status.setErrorMessage("Image resolution is too large");
                    return status;
                }

                double ratio = (double) image.getHeight() / image.getWidth();
                if (ratio > MAX_ASPECT_RATIO) {
                    status.setErrorMessage("Image aspect ratio is too tall");
                    return status;
                }
                status.setIsSuccess(true);
                status.setMessage("Image is valid");
                return status;
            }
            status.setErrorMessage("Please choose an image!");
            return status;
        } catch (IOException e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    private ImageMetadata uploadAvatarToCloudinaryAndResize(
            MultipartFile file,
            String avatarFileName) throws IOException {

        // 1. Cấu hình upload lên Cloudinary
        // Logic cũ: Width 736, Format WebP, Quality 0.8 (80)
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", avatarFileName,
                "folder", AVATAR_FOLDER, // Gom vào folder cho gọn
                "resource_type", "image",
                "format", "webp", // Ép kiểu về WebP
                // Transformation: Resize về 736, giữ tỷ lệ (limit), chất lượng 80
                "transformation", new Transformation().width(736).crop("limit").quality("80")));

        // 2. Lấy thông tin thực tế từ Cloudinary trả về
        int finalWidth = (Integer) uploadResult.get("width");
        int finalHeight = (Integer) uploadResult.get("height");
        long finalSize = Long.parseLong(uploadResult.get("bytes").toString());
        // String secureUrl = (String) uploadResult.get("secure_url"); // URL ảnh trên
        // cloud

        // 3. Trả về Metadata để lưu vào DB
        return new ImageMetadata(
                avatarFileName,
                finalWidth,
                finalHeight,
                finalSize);
    }

    private ImageMetadata uploadImageToCloudinary(
            MultipartFile file,
            String imageId) throws IOException { // Bỏ tham số File imagesFolder vì không lưu ổ cứng nữa

        BufferedImage original = ImageIO.read(file.getInputStream());
        if (original == null)
            throw new IOException("Invalid image");

        int MAX_ORIGINAL_WIDTH = 2560;

        // --- BƯỚC A: UPLOAD BẢN GỐC (BẢO MẬT) ---
        // Tên: imageId_original
        // Logic: Resize về 2560 nếu lớn hơn, Chất lượng 90 (0.9), WebP
        Map uploadResultOriginal;
        uploadResultOriginal = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", imageId,
                "folder", IMAGE_FOLDER,
                "type", "authenticated", // <--- QUAN TRỌNG: Bảo mật
                "resource_type", "image",
                "format", "webp",
                "quality", "90",
                // Resize nếu ảnh lớn hơn 2560, nếu nhỏ hơn thì giữ nguyên (c_limit)
                "transformation", new Transformation().width(MAX_ORIGINAL_WIDTH).crop("limit")));

        // Cập nhật lại width/height thực tế sau khi Cloudinary resize (nếu có)
        int finalWidth = (Integer) uploadResultOriginal.get("width");
        int finalHeight = (Integer) uploadResultOriginal.get("height");
        long finalSize = Long.parseLong((uploadResultOriginal.get("bytes").toString()));

        // Thêm Metadata bản gốc vào List để return (DB cần cái này)
        ImageMetadata createdFiles = new ImageMetadata(
                imageId, // Giữ format tên file cũ
                finalWidth,
                finalHeight,
                finalSize);

        return createdFiles;
    }

    @Override
    public StatusObject<ImageDetailsResponseDto> getImageById(
            String id,
            @Nullable String authEmail) {
        StatusObject<ImageDetailsResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        try {

            Image image = imageRepository.findById(UUID.fromString(id)).orElse(null);
            if (image == null) {
                statusObject.setErrorMessage("Image not found");
                return statusObject;
            }
            User creator = image.getCreator();
            boolean isPublic = creator.isPublic();

            if (authEmail == null) {
                image = isPublic && !image.isDeleted() ? image : null;
                if (image == null) {
                    statusObject.setErrorMessage("Image not found");
                } else {
                    ImageDetailsResponseDto imageDetailsResponseDto = getImageDetailsResponseDto(
                            creator, image, false,
                            false);
                    statusObject.setSuccess(true);
                    statusObject.setMessage("Get image successfully");
                    statusObject.setData(imageDetailsResponseDto);
                }

            } else {
                User authUser = userRepository.findByEmail(authEmail);
                if (authUser != null) {
                    boolean owner = authUser.getId().equals(creator.getId());
                    boolean isLiked;
                    boolean isPurchased = userPurchasedImageRepository.existsUserPurchasedImageByImageIdAndUserId(
                            image.getId(),
                            authUser.getId());
                    if (isPurchased) {
                        isLiked = likeImageRepository.existsLikeImageByUserIdAndImageId(authUser.getId(),
                                image.getId());
                        ImageDetailsResponseDto imageDetailsResponseDto = getImageDetailsResponseDto(
                                creator, image, isLiked,
                                true);
                        statusObject.setSuccess(true);
                        statusObject.setMessage("Get image successfully");
                        statusObject.setData(imageDetailsResponseDto);
                        return statusObject;
                    } else if (image.isDeleted()) {
                        statusObject.setErrorMessage("Image not found");
                        return statusObject;
                    }

                    if (!owner && !isPublic) {
                        image = contactRepository.hasFollowUser(authUser.getId(), creator.getId()) ? image : null;
                        if (image == null) {
                            statusObject.setErrorMessage("Image not found");
                            return statusObject;
                        }
                    }
                    isLiked = likeImageRepository.existsLikeImageByUserIdAndImageId(authUser.getId(), image.getId());
                    ImageDetailsResponseDto imageDetailsResponseDto = getImageDetailsResponseDto(
                            creator, image, isLiked, false);
                    statusObject.setSuccess(true);
                    statusObject.setMessage("Get image successfully");
                    statusObject.setData(imageDetailsResponseDto);
                    return statusObject;
                }
                statusObject.setErrorMessage("Authentication failed");
            }
            return statusObject;
        } catch (IllegalArgumentException e) {
            statusObject.setErrorMessage("Invalid image id");
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public Status deleteImage(
            String id,
            String userEmail) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        Image image = imageRepository.findImageById(UUID.fromString(id));
        if (image == null) {
            status.setErrorMessage("Image not found");
            return status;
        }
        if (!image.getCreator()
                .getId().toString()
                .equalsIgnoreCase(user.getId().toString())) {
            status.setErrorMessage("User is not the owner of the image");
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
    public StatusObject<ImageResponseAndPaginationDto> getImagesForUserHomePage(
            @Nullable String authEmail,
            @Nullable String categorySlug,
            @Nullable String keyword,
            PaginationRequestForClient paginationForClient) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User authUser = authEmail == null ? null : userRepository.findByEmail(authEmail);

            Page<Image> pageResult;
            Pageable pageable = PageRequest.of(paginationForClient.getPage(), 20);
            boolean existCategory = categorySlug != null;
            Category category = null;
            if (existCategory) {
                category = categoryRepository.findCategoryBySlug(categorySlug);
                if (category == null) {
                    statusObject.setErrorMessage("Category does not exist");
                    return statusObject;
                }
            }
            if (authUser != null) {
                if (category != null) {
                    pageResult = imageRepository.findImagesByCategoryIdWithAuth(authUser.getId(), category.getId(),
                            pageable);
                } else if (keyword != null && !keyword.isEmpty()) {
                    pageResult = imageRepository.searchImagesByKeyword(keyword.trim(), authUser.getId().toString(),
                            pageable);
                } else {
                    pageResult = imageRepository.findImagesForUserHomePage(authUser.getId().toString(), pageable);
                }
            } else {
                if (category != null) {
                    pageResult = imageRepository.findImagesByCategoryId(category.getId(), pageable);
                } else if (keyword != null && !keyword.isEmpty()) {
                    pageResult = imageRepository.searchImagesByKeyword(keyword.trim(), null, pageable);
                } else {
                    pageResult = imageRepository.findImagesForHomePage(pageable);
                }
            }

            List<ImageResponseDto> imageResponseDtos = pageResult.getContent()
                    .stream()
                    .map((i) -> {
                        boolean isLiked = false;
                        if (authUser != null) {
                            isLiked = likeImageRepository.existsLikeImageByUserIdAndImageId(
                                    authUser.getId(),
                                    i.getId());
                        }
                        return getImageResponseDto(i.getCreator(), i, isLiked);

                    })
                    .toList();

            if (imageResponseDtos.isEmpty()) {
                statusObject.setMessage("No more images to load");
            } else {
                statusObject.setMessage("Get images successfully");
            }

            statusObject.setSuccess(true);
            statusObject.setData(new ImageResponseAndPaginationDto(
                    pageResult.getTotalPages() > 0 ? pageResult.getTotalPages() - 1 : 0, imageResponseDtos));

            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage("Error: " + e.getMessage());
            return statusObject;
        }
    }

    public ImageUrl setUrlImages(ImageMetadata originalImage) {
        ImageUrl imageUrls = new ImageUrl();

        String uuid = originalImage.getFileName();
        int originalWidth = originalImage.getWidth();

        // 1. URL BẢN GỐC SẠCH (Để user tải sau khi mua)
        String originalSecureUrl = cloudinary.url()
                .type("authenticated")
                .signed(true)
                .generate(IMAGE_FOLDER + "/" + uuid);

        imageUrls.setOriginal(originalSecureUrl);

        // w236
        imageUrls.setW236(originalWidth >= 236
                ? generateSignedWatermarkedUrl(uuid, 236)
                : generateSignedWatermarkedUrl(uuid, originalWidth)); // Fallback: Watermark trên size gốc

        // w474
        imageUrls.setW474(originalWidth >= 474
                ? generateSignedWatermarkedUrl(uuid, 474)
                : (originalWidth >= 236 ? generateSignedWatermarkedUrl(uuid, 236)
                : generateSignedWatermarkedUrl(uuid, originalWidth)));

        // w736
        imageUrls.setW736(originalWidth >= 736
                ? generateSignedWatermarkedUrl(uuid, 736)
                : generateSignedWatermarkedUrl(uuid,
                originalWidth >= 474 ? 474 : (originalWidth >= 236 ? 236 : originalWidth)));

        // w1080
        imageUrls.setW1080(originalWidth >= 1080
                ? generateSignedWatermarkedUrl(uuid, 1080)
                : generateSignedWatermarkedUrl(uuid, originalWidth)); // Fallback: Watermark trên size gốc

        return imageUrls;
    }

    // Hàm hỗ trợ tạo URL Public kèm Watermark & Resize
    private String generateSignedWatermarkedUrl(String uuid, int targetWidth) {
        // g_center: Ở giữa
        String watermarkConfig = "l_" + LOGO_ID + ",w_0.15,fl_relative,o_50,g_center";

        return cloudinary.url()
                .type("authenticated")
                .signed(true)
                .transformation(new Transformation()
                        .width(targetWidth).crop("scale").quality("80").fetchFormat("webp")
                        .chain()
                        .rawTransformation(watermarkConfig) // Dùng chuỗi raw cho an toàn
                )
                .generate(IMAGE_FOLDER + "/" + uuid);
    }

    @Override
    public ImageResponseDto getImageResponseDto(
            User creator,
            Image image,
            boolean isLiked) {
        int commentCount = (int) commentRepository.countCommentByImageId(image.getId());
        UserSummaryDto creatorDto = FileMapper.getUserSummaryDto(creator);
        creatorDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, creatorDto.getAvatar()));
        List<ImageCategory> imageCategories = imageCategoryRepository.findImageCategoriesByImageId(image.getId());
        List<CategoryResponseDto> categoryResponseDtos = imageCategories.stream()
                .map((ic) -> FileMapper.getCategoryResponseDto(ic.getCategory()))
                .toList();
        String originalImageId = image.getImageUrl();
        ImageMetadata imageMetadata = new ImageMetadata(
                originalImageId, 
                image.getWidth(), image.getHeight(),
                image.getFileSize());
        ImageUrl imageUrls = setUrlImages(imageMetadata);
        return ImageResponseDto.builder()
                .id(image.getId().toString())
                .width(image.getWidth())
                .height(image.getHeight())
                .creator(creatorDto)
                .imageUrls(imageUrls)
                .price(image.getPrice())
                .categories(categoryResponseDtos)
                .likeCount(image.getLikeCount())
                .commentCount(commentCount)
                .isLiked(isLiked)
                .isVisible(image.isPublic())
                .isDeleted(image.isDeleted())
                .createdDate(image.getCreatedDate())
                .build();
    }

    public ImageDetailsResponseDto getImageDetailsResponseDto(
            User creator,
            Image image,
            boolean isLiked,
            boolean isPurchased) {
        int commentCount = (int) commentRepository.countCommentByImageId(image.getId());
        List<ImageCategory> imageCategories = imageCategoryRepository.findImageCategoriesByImageId(image.getId());
        List<CategoryResponseDto> categoryResponseDtos = imageCategories.stream()
                .map((ic) -> FileMapper.getCategoryResponseDto(ic.getCategory()))
                .toList();
        UserSummaryDto creatorDto = FileMapper.getUserSummaryDto(creator);
        creatorDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, creatorDto.getAvatar()));
        String originalImageId = image.getImageUrl();
        ImageMetadata imageMetadata = new ImageMetadata(
                originalImageId, 
                image.getWidth(), image.getHeight(),
                image.getFileSize());
        ImageUrl imageUrls = setUrlImages(imageMetadata);
        return ImageDetailsResponseDto.builder()
                .id(image.getId().toString())
                .creator(creatorDto)
                .imageUrls(imageUrls)
                .categories(categoryResponseDtos)
                .description(image.getDescription())
                .likeCount(image.getLikeCount())
                .commentCount(commentCount)
                .price(image.getPrice())
                .isLiked(isLiked)
                .isPurchased(isPurchased)
                .isDeleted(image.isDeleted())
                .createdDate(image.getCreatedDate())
                .build();
    }

    //
    // @Override
    // public StatusObject<List<ImageResponseDto>> getImagesByBoard(
    // String userId,
    // String boardId,
    // PaginationRequestForClient paginationForClient,
    // @Nullable String authEmail
    // ) {
    //
    // StatusObject<List<ImageResponseDto>> statusObject = new StatusObject<>(false,
    // "", "", null);
    // try {
    // User creator = userRepository.findUserById(userId);
    // if (creator == null) {
    // statusObject.setErrorMessage("User not found");
    // return statusObject;
    // }
    // Board board = boardRepository.findBoardById(boardId);
    // if (board == null) {
    // statusObject.setErrorMessage("Board not found");
    // return statusObject;
    // }
    // if (!board.getUser()
    // .getId()
    // .equalsIgnoreCase(creator.getId())) {
    // statusObject.setErrorMessage("User are not the owner of this board");
    // return statusObject;
    // }
    //
    // boolean isOwner = false;
    // boolean isFollowing = false;
    // if (authEmail != null) {
    // User authUser = userRepository.findByEmail(authEmail);
    // if (authUser != null && authUser.getId()
    // .equals(userId)) {
    // isOwner = true;
    // } else if (authUser != null) {
    // isFollowing = contactRepository.hasFollowUser(authUser.getId(), userId);
    // }
    // }
    // Pageable pageable = PageRequest.of(paginationRequest.getPage(),
    // paginationRequest.getSize());
    // Page<Image> pageResult;
    // if (isOwner) {
    // pageResult = imageRepository.findImagesByBoardId(boardId, pageable);
    // } else {
    // if (board.isSecret()) {
    // statusObject.setErrorMessage("Board is secret");
    // return statusObject;
    // }
    // if (creator.isPublic()) {
    // pageResult = imageRepository.findImagesByBoardIdAndNotSecret(boardId,
    // pageable);
    // } else {
    // if (isFollowing) {
    // pageResult = imageRepository.findImagesByBoardIdAndNotSecret(boardId,
    // pageable);
    // } else {
    // pageResult = null;
    // }
    // }
    // }
    // if (pageResult == null || pageResult.isEmpty()) {
    // statusObject.setSuccess(true);
    // statusObject.setMessage("No image found");
    // return statusObject;
    // }
    //
    // List<ImageResponseDto> imageResponseDtos = pageResult.getContent()
    // .stream()
    // .map((i) -> getImageResponseDto(i.getCreator(), i))
    // .toList();
    // statusObject.setSuccess(true);
    // statusObject.setMessage("Get all images successfully");
    // statusObject.setData(imageResponseDtos);
    // return statusObject;
    // } catch (Exception e) {
    // statusObject.setErrorMessage(e.getMessage());
    // return statusObject;
    // }
    // }

    @Override
    public StatusObject<ImageResponseAndPaginationDto> getAllLikeImagesOfUser(
            String userEmail,
            PaginationRequestForClient paginationForClient) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }

            Pageable pageable = PageRequest.of(paginationForClient.getPage(), 10);
            Page<Image> pageResult = imageRepository.findAllLikeImagesOfUser(user.getId(), pageable);

            if (pageResult.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseDto> imageResponseDtos = pageResult.getContent()
                    .stream()
                    .map((i) -> {
                        return getImageResponseDto(i.getCreator(), i, true);

                    })
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all images successfully");
            statusObject.setData(new ImageResponseAndPaginationDto(
                    pageResult.getTotalPages() > 0 ? pageResult.getTotalPages() - 1 : 0, imageResponseDtos));
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Integer> countImages() {
        StatusObject<Integer> status = new StatusObject<>(false, "", "", 0);
        try {
            int countImages = (int) imageRepository.countImages();
            status.setSuccess(true);
            status.setMessage(countImages + " images found");
            status.setData(countImages);
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    @Transactional
    public StatusObject<CommentCountDto> comment(
            CreateCommentRequest createCommentRequest,
            String senderEmail) {
        StatusObject<CommentCountDto> statusObject = new StatusObject<>(false, "", "", null);
        User sender = userRepository.findByEmail(senderEmail);
        if (sender == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }
        Image image = imageRepository.findImageByIdAndIsPublic(UUID.fromString(createCommentRequest.getImageId()));
        if (image == null) {
            statusObject.setErrorMessage("Image not found");
            return statusObject;
        }
        boolean isCreatorPublic = image.getCreator().isPublic();
        boolean isBlockedTogether = contactRepository.hasBlockedRelationship(sender.getId(),
                image.getCreator().getId());
        if (isBlockedTogether) {
            statusObject.setErrorMessage("This creator has blocked you or vice");
            return statusObject;
        }
        if (!isCreatorPublic) {
            boolean isSenderFollowedCreator = contactRepository.hasFollowUser(sender.getId(),
                    image.getCreator().getId());
            if (!isSenderFollowedCreator) {
                statusObject.setErrorMessage("You have to follow the creator to comment");
                return statusObject;
            }
        }
        String parentId = createCommentRequest.getParentId();
        Comment newComment = new Comment();
        newComment.setContent(createCommentRequest.getContent());
        newComment.setImage(image);
        newComment.setUser(sender);
        newComment.setParentId(parentId != null && !parentId.isEmpty() ? UUID.fromString(parentId) : null);
        newComment.setLikeCount(0);
        newComment.setCreatedDate(LocalDateTime.now());

        commentRepository.save(newComment);
        CommentResponseDto commentResponseDto = FileMapper.getCommentResponseDto(newComment);
        CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest();
        createNotificationRequest.setPayloadForCommentYourPost(
                new CreateNotificationRequest.PayloadForCommentYourPost(commentResponseDto));
        StatusObject<Object> notificationStatusObject;

        if (createCommentRequest.getParentId() == null || createCommentRequest.getParentId()
                .isEmpty()) {
            if (!sender.getId().equals(image.getCreator().getId())) {
                createNotificationRequest.setType(NotificationType.COMMENT);
                createNotificationRequest.setUserReceivingId(image.getCreator()
                        .getId().toString());
                createNotificationRequest.setReferenceId(image.getId().toString());
                createNotificationRequest.setChildReferenceId(newComment.getId().toString());
                notificationStatusObject = notificationService.createNotification(
                        createNotificationRequest,
                        senderEmail);
                if (!notificationStatusObject.isSuccess()) {
                    statusObject.setErrorMessage(notificationStatusObject.getErrorMessage());
                    return statusObject;
                }
            }

        } else {
            Comment parentComment = commentRepository.findById(UUID.fromString(createCommentRequest.getParentId()))
                    .orElse(null);
            if (parentComment == null) {
                statusObject.setErrorMessage("Parent comment not found");
                return statusObject;
            }
            createNotificationRequest.setType(NotificationType.REPLY_COMMENT);
            createNotificationRequest.setUserReceivingId(parentComment.getUser()
                    .getId().toString());
            createNotificationRequest.setReferenceId(parentComment.getImage()
                    .getId().toString());
            createNotificationRequest.setChildReferenceId(newComment.getId().toString());
            if (!sender.getId().equals(parentComment.getUser().getId())) {
                notificationStatusObject = notificationService.createNotification(
                        createNotificationRequest,
                        senderEmail);
                if (!notificationStatusObject.isSuccess()) {
                    statusObject.setErrorMessage(notificationStatusObject.getErrorMessage());
                    return statusObject;
                }
            }

        }

        int commentCount = (int) commentRepository.countCommentByImageId(image.getId());

        commentRepository.save(newComment);
        statusObject.setSuccess(true);
        statusObject.setMessage("Create comment successfully");
        statusObject.setData(new CommentCountDto(commentCount + 1));
        return statusObject;

    }

    @Transactional
    @Override
    public StatusObject<LikeResponseDto> like(
            CreateLikeImageRequest createLikeImageRequest,
            String userEmail) {
        StatusObject<LikeResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        User sender = userRepository.findByEmail(userEmail);
        if (sender == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }
        Image image = imageRepository.findImageByIdAndIsPublic(UUID.fromString(createLikeImageRequest.getImageId()));
        if (image == null) {
            statusObject.setErrorMessage("Image not found");
            return statusObject;
        }
        boolean isCreatorPublic = image.getCreator().isPublic();
        boolean hasSenderFollowedCreator = contactRepository.hasFollowUser(sender.getId(), image.getCreator().getId());
        boolean isOwner = sender.getId().equals(image.getCreator().getId());
        LikeImage likedImage = likeImageRepository.findByUserIdAndImageId(sender.getId(), image.getId());
        if (likedImage != null) {
            likeImageRepository.delete(likedImage);
            statusObject.setSuccess(true);
            statusObject.setMessage("Unliked image successfully");
            image.setLikeCount(image.getLikeCount() - 1);
            imageRepository.save(image);

            LikeResponseDto likeImageResponseDto = LikeResponseDto.builder()
                    .likeCountOfImage(image.getLikeCount())
                    .build();
            statusObject.setData(likeImageResponseDto);
            return statusObject;
        } else if (isOwner || isCreatorPublic || (!isCreatorPublic && hasSenderFollowedCreator)) {
            image.setLikeCount(image.getLikeCount() + 1);
            imageRepository.save(image);
            if (!isOwner) {
                Notification existNotification = notificationRepository
                        .findNotificationBySenderAndRecipientAndReferenceIdAndType(
                                sender.getId(),
                                image.getCreator()
                                        .getId(),
                                UUID.fromString(createLikeImageRequest.getImageId()),
                                NotificationType.LIKE.toString()
                                        .toUpperCase());
                if (existNotification == null) {
                    CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest();
                    createNotificationRequest.setUserReceivingId(image.getCreator()
                            .getId().toString());
                    createNotificationRequest.setType(NotificationType.LIKE);
                    createNotificationRequest.setReferenceId(createLikeImageRequest.getImageId());
                    createNotificationRequest
                            .setPayloadForLikeYourPost(new CreateNotificationRequest.PayloadForLikeYourPost(
                                    createLikeImageRequest.getImageId()));
                    StatusObject<Object> notificationStatus = notificationService
                            .createNotification(createNotificationRequest, sender.getEmail());
                    if (!notificationStatus.isSuccess()) {
                        statusObject.setErrorMessage(notificationStatus.getErrorMessage());
                        return statusObject;
                    }
                }
            }
            LikeResponseDto likeImageResponseDto = LikeResponseDto.builder()
                    .likeCountOfImage(image.getLikeCount())
                    .build();
            LikeImage likeImage = new LikeImage();
            likeImage.setUser(sender);
            likeImage.setImage(image);
            likeImageRepository.save(likeImage);

            statusObject.setSuccess(true);
            statusObject.setMessage("Liked image successfully");
            statusObject.setData(likeImageResponseDto);
            return statusObject;
        }
        boolean isBlockedTogether = contactRepository.hasBlockedRelationship(sender.getId(),
                image.getCreator().getId());
        if (isBlockedTogether) {
            statusObject.setErrorMessage("This creator has blocked you or vice");

        }
        statusObject.setErrorMessage("You have to follow this user to like their image");
        return statusObject;
    }

    @Override
    public StatusObject<ImageResponseAndPaginationDto> getAllPurchasedImagesOfUser(
            String userEmail,
            PaginationRequestForClient paginationForClient) {
        StatusObject<ImageResponseAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }

            Pageable pageable = PageRequest.of(paginationForClient.getPage(), 10);
            Page<Image> pageResult = userPurchasedImageRepository.findAllPurchasedImageByUser(user.getId(),
                    pageable);

            if (pageResult.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No image found");
                return statusObject;
            }

            List<ImageResponseDto> imageResponseDtos = pageResult.getContent()
                    .stream()
                    .map((i) -> {
                        boolean isLiked = likeImageRepository.existsLikeImageByUserIdAndImageId(user.getId(),
                                i.getId());
                        return getImageResponseDto(i.getCreator(), i, isLiked);

                    })
                    .toList();
            statusObject.setSuccess(true);
            statusObject.setMessage("Get all purchased images successfully");
            statusObject.setData(new ImageResponseAndPaginationDto(
                    pageResult.getTotalPages() > 0 ? pageResult.getTotalPages() - 1 : 0, imageResponseDtos));
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public Status updateImage(String imageId, UpdateImageRequest updateImageRequest, String userEmail) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        Image image = imageRepository.findImageById(UUID.fromString(imageId));
        if (image == null) {
            status.setErrorMessage("Image not found");
            return status;
        }
        if (!image.getCreator().getId().equals(user.getId())) {
            status.setErrorMessage("You are not the owner of the image");
            return status;
        }
        List<UUID> categoryIds = updateImageRequest.getCategoryIds().stream().map(UUID::fromString).toList();
        List<Category> categories = categoryRepository.findCategoriesByIds(categoryIds);
        if (categories.isEmpty()) {
            status.setErrorMessage("Every category that you choose not found, please choose another one");
            return status;
        }
        int validCategoriesCount = 0;
        if (categories.isEmpty()) {
            status.setErrorMessage("Every category that you choose not found, please choose another one");
            return status;
        }
        if (categories.size() < updateImageRequest.getCategoryIds()
                .size()) {
            validCategoriesCount = updateImageRequest.getCategoryIds()
                    .size() - categories.size();
        }
        image.setDescription(updateImageRequest.getDescription());
        image.setPrice(updateImageRequest.getPrice());
        image.setPublic(updateImageRequest.isVisible());
        List<ImageCategory> existingImageCategories = imageCategoryRepository
                .findImageCategoriesByImageId(image.getId());
        if (!existingImageCategories.isEmpty()) {
            imageCategoryRepository.deleteAll(existingImageCategories);
        }

        List<ImageCategory> imageCategories = new ArrayList<>();
        for (Category category : categories) {
            ImageCategory imageCategory = new ImageCategory();
            imageCategory.setImage(image);
            imageCategory.setCategory(category);

            imageCategories.add(imageCategory);
        }
        imageRepository.save(image);
        imageCategoryRepository.saveAll(imageCategories);
        status.setIsSuccess(true);
        if (validCategoriesCount != 0) {
            status.setMessage(
                    "Update image successfully but there is " + validCategoriesCount + " categories not found  ");
        } else {
            status.setMessage("Update image successfully");
        }
        return status;
    }
}
