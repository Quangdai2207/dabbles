package ti.dabble.services.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import jakarta.annotation.Nullable;
import ti.dabble.dtos.ImageMetadata;
import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.dtos.ProfileUserWithImageDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.entities.Category;
import ti.dabble.entities.Contact;
import ti.dabble.entities.Role;
import ti.dabble.entities.User;
import ti.dabble.entities.UserFollowedCategory;
import ti.dabble.enums.ContactStatus;
import ti.dabble.enums.ImageType;
import ti.dabble.enums.NotificationType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.CategoryRepository;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.LikeImageRepository;
import ti.dabble.repositories.RoleRepository;
import ti.dabble.repositories.UserFollowedCategoryRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.requests.ChangePasswordRequest;
import ti.dabble.requests.CreateFollowedCategoryForUserRequest;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.UpdateInfoUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.image.IImageService;
import ti.dabble.services.notification.INotificationService;

@Service
public class UserService implements IUserService, UserDetailsService {
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private UserFollowedCategoryRepository userFollowedCategoryRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private IImageService imageService;
    @Autowired
    private LikeImageRepository likeImageRepository;
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userInfo = userRepository.findByEmail(username);
        if (userInfo == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
        if (userInfo.isDeleted()) {
            throw new UsernameNotFoundException("User is deleted");
        }
        int roleId = Integer.parseInt(userInfo.getRoleId());
        Optional<Role> roleOptional = roleRepository.findById(roleId);
        if (roleOptional.isEmpty()) {
            throw new UsernameNotFoundException("Role not found for user: " + username);
        }
        String roleName = roleOptional.get()
                .getName()
                .toUpperCase();
        GrantedAuthority authority = new SimpleGrantedAuthority(roleName);

        List<GrantedAuthority> authorities = Collections.singletonList(authority);

        return new org.springframework.security.core.userdetails.User(
                userInfo.getEmail(),
                userInfo.getPassword(),
                authorities);
    }

    @Override
    public StatusObject<Integer> countUsers() {
        StatusObject<Integer> status = new StatusObject<>(false, "", "", 0);
        try {
            int countUsers = (int) userRepository.countUsers();
            status.setSuccess(true);
            status.setMessage(countUsers + " users found");
            status.setData(countUsers);
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<List<User>> getAllUsers() {
        StatusObject<List<User>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<User> users = userRepository.findAllUser();
            if (users.isEmpty()) {
                statusObject.setMessage("No user found");
            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all user successfully");
            }
            for (User user : users) {
                user.setPassword(null);
            }
            users.forEach((u) -> u.setAvatar(FileHelper.getAvatarUrl(cloudinary, u.getAvatar())));
            statusObject.setData(users);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<User> getUserById(String userId) {
        StatusObject<User> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findUserById(UUID.fromString(userId));
            if (user == null) {
                statusObject.setMessage("No user found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all user successfully");
                user.setAvatar(FileHelper.getAvatarUrl(cloudinary, user.getAvatar()));
                user.setPassword(null);
            }
            statusObject.setData(user);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<ProfileUserDto> getUserByEmail(String email) {
        StatusObject<ProfileUserDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                statusObject.setMessage("No user found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all user successfully");
            }
            LocalDateTime endDate = userSubscriptionRepository.getExpiredDayOfUser(user.getId(), LocalDateTime.now());
            ProfileUserDto profileUserDto = mapper.map(user, ProfileUserDto.class);
            profileUserDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, profileUserDto.getAvatar()));

            profileUserDto.setExpiredDay(endDate);

            statusObject.setData(profileUserDto);
            return statusObject;
        } catch (Exception e) {
            return statusObject;
        }
    }

    @Transactional
    @Override
    public StatusObject<ProfileUserDto> update(
            UpdateInfoUserRequest updateInfoUserRequest) {
        try {
            StatusObject<ProfileUserDto> statusObject = new StatusObject<>(false, "", "", null);

            User user = getUserByAuthentication();
            if (user == null) {
                statusObject.errorMessage = "User not found";
                return statusObject;
            }
            if (userRepository.existsByPhone(updateInfoUserRequest.getPhone()) && !user.getPhone()
                    .equalsIgnoreCase(updateInfoUserRequest.getPhone())) {
                statusObject.errorMessage = "Phone already exists";
                return statusObject;
            }
            if (userRepository.existsByUsername(updateInfoUserRequest.getUsername()) && !user.getUsername()
                    .equalsIgnoreCase(updateInfoUserRequest.getUsername())) {
                statusObject.errorMessage = "Username already exists";
                return statusObject;
            }

            MultipartFile file = updateInfoUserRequest.getAvatar();
            if (file != null && !file.isEmpty()) {
                StatusObject<ImageMetadata> uploadStatus = imageService.uploadImage(file, ImageType.AVATARS);
                if (uploadStatus.isSuccess && uploadStatus.getData() != null) {
                    user.setAvatar(uploadStatus.getData().getFileName());
                } else {
                    statusObject.errorMessage = "Image upload failed: " + uploadStatus.errorMessage;
                    return statusObject;
                }
            }
            user.setUsername(updateInfoUserRequest.getUsername());
            user.setFirstname(updateInfoUserRequest.getFirstName());
            user.setLastname(updateInfoUserRequest.getLastName());
            user.setPhone(updateInfoUserRequest.getPhone());
            user.setDateOfBirth(updateInfoUserRequest.getDateOfBirth());
            userRepository.save(user);

            LocalDateTime endDate = userSubscriptionRepository.getExpiredDayOfUser(user.getId(), LocalDateTime.now());
            ProfileUserDto profileUserDto = mapper.map(user, ProfileUserDto.class);
            profileUserDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, profileUserDto.getAvatar()));
            profileUserDto.setExpiredDay(endDate);
            statusObject.setSuccess(true);
            statusObject.setMessage("User updated successfully");
            statusObject.setData(profileUserDto);
            return statusObject;
        } catch (Exception e) {
            e.printStackTrace();
            StatusObject<ProfileUserDto> statusObject = new StatusObject<>(false, "", "", null);
            statusObject.errorMessage = "An unexpected error occurred: " + e.getMessage();
            return statusObject;
        }
    }

    @Override
    public Status changePassword(ChangePasswordRequest changePasswordRequest) {
        Status status = new Status();
        try {
            User user = getUserByAuthentication();
            if (user == null) {
                status.message = "User not found";
                return status;
            }
            if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
                status.message = "Current password is incorrect";
                return status;
            }
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getPassword()));
            userRepository.save(user);
            status.isSuccess = true;
            status.message = "Password changed successfully";
        } catch (Exception e) {
            status.message = "An unexpected error occurred: " + e.getMessage();
            return status;
        }
        return status;
    }

    @Transactional
    @Override
    public Status toggleAccountPrivacy() {
        Status status = new Status(false, "", "");
        User user = getUserByAuthentication();
        if (user == null) {
            status.message = "User not found";
            return status;
        }

        if (!user.isPublic()) {
            List<Contact> contactsOfUser = contactRepository.findByContactUserIdAndStatus(user.getId(),
                    ContactStatus.PENDING.getId());
            for (Contact contact : contactsOfUser) {
                contact.setStatus(ContactStatus.ACCEPTED.getId());
                contactRepository.save(contact);
                CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
                notificationRequest.setType(NotificationType.ACCEPTED);
                notificationRequest.setReferenceId(contact.getContactUser()
                        .getId().toString());
                notificationRequest.setUserReceivingId(contact.getUser()
                        .getId().toString());
                StatusObject<Object> notification = notificationService.createNotification(
                        notificationRequest, user.getEmail());
                if (!notification.isSuccess) {
                    status.message = "An unexpected error occurred: " + notification.errorMessage;
                    return status;
                }
            }
            user.setPublic(true);
        } else {
            user.setPublic(false);
        }

        userRepository.save(user);
        status.isSuccess = true;
        status.message = "Your account is " + (user.isPublic() ? "public" : "private") + " now";
        return status;
    }

    public User getUserByAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName());
    }

    @Override
    public StatusObject<ProfileUserWithImageDto> profileUserWithImage(
            String username,
            @Nullable String authEmail) {
        StatusObject<ProfileUserWithImageDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByUsername(username);
            if (user == null || user.getRoleId()
                    .equalsIgnoreCase(String.valueOf(ti.dabble.enums.Role.SUPERADMIN.getId())) || user.getRoleId()
                    .equalsIgnoreCase(String.valueOf(ti.dabble.enums.Role.ADMIN.getId()))) {
                statusObject.errorMessage = "User not found";
                return statusObject;
            }

            int follower = (int) contactRepository.countFollowerOfUser(user.getId());
            int following = (int) contactRepository.countFollowingOfUser(user.getId());
            ContactStatus followStatus = ContactStatus.UNFOLLOW;
            int pendingRequestCount = 0;
            if (authEmail != null && !authEmail.isEmpty()) {
                User authUser = userRepository.findByEmail(authEmail);
                if (authUser != null) {
                    Contact contact = contactRepository.findByUserIdAndContactUserId(authUser.getId(), user.getId());
                    boolean isBlockedByUser = contactRepository.hasBlockUser(user.getId(), authUser.getId());
                    if (isBlockedByUser) {
                        statusObject.errorMessage = "You are blocking by this person";
                        return statusObject;
                    } else {
                        if (contact != null) {
                            if (contact.getStatus() == ContactStatus.ACCEPTED.getId()) {
                                followStatus = ContactStatus.ACCEPTED;
                            } else if (contact.getStatus() == ContactStatus.PENDING.getId()) {
                                followStatus = ContactStatus.PENDING;
                            } else if (contact.getStatus() == ContactStatus.BLOCKED.getId()) {
                                statusObject.errorMessage = "You are blocking this person";
                                return statusObject;
                            }
                        }
                    }
                    if (authUser.getId()
                            .equals(user.getId())) {
                        pendingRequestCount = (int) contactRepository.countPendingOfUser(user.getId());
                    }

                }
            }
            int totalLike = (int) likeImageRepository.totalLikeByUserId(user.getId());
            LocalDateTime endDate = userSubscriptionRepository.getExpiredDayOfUser(user.getId(), LocalDateTime.now());
            ProfileUserWithImageDto profileUserWithImageDto = ProfileUserWithImageDto.builder()
                    .id(user.getId().toString())
                    .username(user.getUsername())
                    .name(user.getFirstname() + " " + user.getLastname())
                    .avatar(FileHelper.getAvatarUrl(cloudinary, user.getAvatar()))
                    .bio(user.getBio())
                    .follower(follower)
                    .following(following)
                    .totalLike(totalLike)
                    .pendingRequestCount(pendingRequestCount)
                    .followStatus(followStatus)
                    .expiredDay(endDate == null ? null : endDate)
                    .build();
            statusObject.setSuccess(true);
            statusObject.setMessage("User found");
            statusObject.setData(profileUserWithImageDto);
        } catch (Exception e) {
            statusObject.errorMessage = "An unexpected error occurred: " + e.getMessage();
            return statusObject;
        }
        return statusObject;
    }

    @Transactional
    @Override
    public Status addFollowedCategory(
            String authEmail,
            CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest) {
        Status statusObject = new Status(false, "", "");
        User user = userRepository.findByEmail(authEmail);
        if (user == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }
        List<Category> existingCategory = userFollowedCategoryRepository.findByUserId(user.getId()).stream()
                .map(UserFollowedCategory::getCategory).toList();
        List<UUID> existingCategoryIds = existingCategory.stream()
                .map(Category::getId)
                .toList();
        List<UUID> categories = createFollowedCategoryForUserRequest.getCategoryIds().stream().map(UUID::fromString).toList();

        List<UUID> categoriesToAdd = categories.stream().filter(categoryId -> !existingCategoryIds.contains(categoryId)).toList();
        List<Category> followedCategories = categoryRepository
                .findCategoriesByIds(categoriesToAdd);
        if (followedCategories.isEmpty()) {
            statusObject.setErrorMessage("Categories which you want to follow not found");
            return statusObject;
        }
        List<UserFollowedCategory> userFollowedCategories = new ArrayList<>();
        for (Category category : followedCategories) {
            UserFollowedCategory userFollowedCategory = new UserFollowedCategory();
            userFollowedCategory.setUser(user);
            userFollowedCategory.setCategory(category);
            userFollowedCategories.add(userFollowedCategory);
        }

        userFollowedCategoryRepository.saveAll(userFollowedCategories);
        statusObject.setIsSuccess(true);
        statusObject.setMessage("Followed category added successfully");
        return statusObject;
    }

    @Transactional
    @Override
    public Status updateFollowedCategory(
            String authEmail,
            CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest) {
        Status statusObject = new Status(false, "", "");
        User user = userRepository.findByEmail(authEmail);
        if (user == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }
        List<UUID> requestCategories = createFollowedCategoryForUserRequest.getCategoryIds().stream()
                .map(UUID::fromString)
                .toList();
        List<UserFollowedCategory> existingCategories = userFollowedCategoryRepository
                .findByUserId(user.getId());
        List<UUID> existingCategoryIds = existingCategories.stream()
                .map(ufc -> ufc.getCategory().getId())
                .toList();
        List<UUID> categoriesToRemove = existingCategoryIds.stream()
                .filter(existingId -> !requestCategories.contains(existingId))
                .toList();

        List<UUID> categoriesToAdd = requestCategories.stream()
                .filter(requestId -> !existingCategoryIds.contains(requestId))
                .toList();
        if (!categoriesToRemove.isEmpty()) {
            userFollowedCategoryRepository.deleteByCategoryIdsAndUserId(categoriesToRemove, user.getId());
        }
        if (!categoriesToAdd.isEmpty()) {
            List<Category> requestCategoriesToAdd = categoryRepository.findCategoriesByIds(categoriesToAdd);

            if (requestCategoriesToAdd.isEmpty()) {
                statusObject.setErrorMessage("Categories which you want to follow not found");
                return statusObject;
            }
            if (requestCategoriesToAdd.size() < categoriesToAdd.size()) {
                statusObject.setErrorMessage("Some categories which you want to follow not found");
                return statusObject;
            }
            List<UserFollowedCategory> userFollowedCategories = new ArrayList<>();
            for (Category category : requestCategoriesToAdd) {
                UserFollowedCategory userFollowedCategory = new UserFollowedCategory();
                userFollowedCategory.setUser(user);
                userFollowedCategory.setCategory(category);
                userFollowedCategories.add(userFollowedCategory);
            }
            userFollowedCategoryRepository.saveAll(userFollowedCategories);
        }
        statusObject.setIsSuccess(true);
        statusObject.setMessage("Followed category updated successfully");
        return statusObject;
    }

    @Override
    public StatusObject<List<UserSummaryDto>> searchByUsername(String username, @Nullable String authEmail) {
        StatusObject<List<UserSummaryDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Pageable pageable = PageRequest.of(0, 5);
            User auth = userRepository.findByEmail(authEmail);
            Page<User> users = userRepository.searchByUsername(username,
                    auth == null ? null : auth.getId(),
                    pageable);
            if (users.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No user found");
                return statusObject;
            }
            List<UserSummaryDto> userSummaryDtos = users.getContent().stream().map((u) -> {
                        UserSummaryDto dto = FileMapper.getUserSummaryDto(u);
                        dto.setAvatar(FileHelper.getAvatarUrl(cloudinary, dto.getAvatar()));
                        return dto;
                    })
                    .toList();
            statusObject.setMessage("Search user successfully");
            statusObject.setSuccess(true);
            statusObject.setData(userSummaryDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }
}
