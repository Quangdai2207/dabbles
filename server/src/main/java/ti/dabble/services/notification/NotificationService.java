package ti.dabble.services.notification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinary.Cloudinary;

import ti.dabble.dtos.BaseNotificationAndPaginationDto;
import ti.dabble.dtos.BaseNotificationResponseDto;
import ti.dabble.dtos.BaseNotificationWithTotalResponseDto;
import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.dtos.MarkAsReadNotificationResponseDto;
import ti.dabble.dtos.NotificationResponseForAboutToExpiredSubscriptionDto;
import ti.dabble.dtos.NotificationResponseForAcceptOrFollowDto;
import ti.dabble.dtos.NotificationResponseForCommentOrReplyDto;
import ti.dabble.dtos.NotificationResponseForLikeYourPostDto;
import ti.dabble.dtos.NotificationResponseForSaleImageDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.entities.Comment;
import ti.dabble.entities.Image;
import ti.dabble.entities.Notification;
import ti.dabble.entities.User;
import ti.dabble.enums.NotificationType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.CommentRepository;
import ti.dabble.repositories.ImageRepository;
import ti.dabble.repositories.NotificationRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.PaginationRequestForClient;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

@Service
public class NotificationService implements INotificationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    @Override
    public StatusObject<Object> createNotification(
            CreateNotificationRequest createNotificationRequest,
            String senderEmail) {
        StatusObject<Object> statusObject = new StatusObject<>(false, "", "", null);
        User sender = userRepository.findByEmail(senderEmail);
        if (sender == null) {
            statusObject.setErrorMessage("Sender not found");
            return statusObject;
        }
        User userReceiving = userRepository
                .findUserById(UUID.fromString(createNotificationRequest.getUserReceivingId()));
        if (userReceiving == null) {
            statusObject.setErrorMessage("User receiving not found");
            return statusObject;
        }
        UserSummaryDto senderDto = FileMapper.getUserSummaryDto(sender);
        senderDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, senderDto.getAvatar()));
        int totalNotifications = (int) notificationRepository.countTotalNotification(userReceiving.getId());
        NotificationType typeOfRequest = createNotificationRequest.getType();
        BaseNotificationWithTotalResponseDto notiDtos = new BaseNotificationWithTotalResponseDto();
        notiDtos.setTotalNotifications(totalNotifications + 1);
        notiDtos.setNotification(null);
        String referenceId = createNotificationRequest.getReferenceId();
        String childReferenceId = createNotificationRequest.getChildReferenceId();
        Notification notification = new Notification();

        notification.setType(createNotificationRequest.getType()
                .toString());
        notification.setRecipient(userReceiving);
        notification.setSender(sender);

        notification.setReferenceId(referenceId == null ? null : UUID.fromString(referenceId));
        notification.setChildReferenceId(childReferenceId == null ? null : UUID.fromString(childReferenceId));
        notification.setCreatedDate(LocalDateTime.now());
        notificationRepository.save(notification);
        String content = "";
        if (typeOfRequest == NotificationType.LIKE && createNotificationRequest.getPayloadForLikeYourPost() != null) {
            content = " liked your post";
            notiDtos.setNotification(getNotificationResponseForLikeYourPostDto(
                    notification,
                    createNotificationRequest.getPayloadForLikeYourPost(),
                    senderDto));
        } else if (typeOfRequest == NotificationType.FOLLOW_REQUEST) {
            if (notification.getRecipient()
                    .isPublic()) {
                content = "started following you";
            } else {
                content = "sent you a follow request";
            }
            notiDtos.setNotification(getNotificationResponseForAcceptOrFollowDto(
                    notification,
                    senderDto));

        } else if (typeOfRequest == NotificationType.ACCEPTED) {
            content = "accepted your follow request";
            notiDtos.setNotification(getNotificationResponseForAcceptOrFollowDto(
                    notification,
                    senderDto));
        } else if (typeOfRequest == NotificationType.COMMENT
                && createNotificationRequest.getPayloadForCommentYourPost() != null) {
            content = "commented on your post";

            notiDtos.setNotification(getNotificationResponseForCommentOrReplyDto(
                    notification,
                    createNotificationRequest.getPayloadForCommentYourPost()));
        } else if (typeOfRequest == NotificationType.REPLY_COMMENT
                && createNotificationRequest.getPayloadForCommentYourPost() != null) {
            content = "replied to your comment";
            notiDtos.setNotification(getNotificationResponseForCommentOrReplyDto(
                    notification,
                    createNotificationRequest.getPayloadForCommentYourPost()));
        } else if (typeOfRequest == NotificationType.SALE_IMAGE
                && createNotificationRequest.getPayloadForSaleImage() != null) {
            content = "buy your image";
            notiDtos.setNotification(getNotificationResponseForSaleImageDto(
                    notification,
                    createNotificationRequest.getPayloadForSaleImage(),
                    senderDto));
        } else if (typeOfRequest == NotificationType.SUBSCRIPTION
                && createNotificationRequest.getPayloadForAboutToExpiredSubscription() != null) {
            content = createNotificationRequest.getPayloadForAboutToExpiredSubscription().getContent();
            notiDtos.setNotification(getNotificationForAboutToExpiredSubscriptionDto(notification));
            notification.setSender(null);
        }

        if (notiDtos.getNotification() == null) {
            statusObject.setErrorMessage("Created notification failed");
            return statusObject;
        }

        notification.setContent(content);

        notification.setRead(false);
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(
                userReceiving.getEmail(),
                "/queue/notification",
                notiDtos);

        statusObject.setSuccess(true);
        statusObject.setMessage("Notification created");
        statusObject.setData(notiDtos);
        return statusObject;
    }

    @Override
    public Status markAsRead(
            String notificationId,
            String userEmail) {
        Status status = new Status(false, "", "");
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                status.setErrorMessage("User not found");
                return status;
            }
            Notification notification = notificationRepository.findNotificationById(UUID.fromString(notificationId));
            if (notification == null) {
                status.setErrorMessage("Notification not found");
                return status;
            }
            notification.setRead(true);
            notificationRepository.save(notification);
            int totalNotification = (int) notificationRepository.countTotalNotification(user.getId());
            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/read-notification",
                    new MarkAsReadNotificationResponseDto(totalNotification, notificationId));
            status.setIsSuccess(true);
            status.setMessage("Mark as read successfully");
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<Integer> totalNotification(String userEmail) {
        StatusObject<Integer> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            int totalNotification = (int) notificationRepository.countTotalNotification(user.getId());
            statusObject.setSuccess(true);
            statusObject.setMessage("Total notification");
            statusObject.setData(totalNotification);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<BaseNotificationAndPaginationDto> getAllNotification(String userEmail,
                                                                             PaginationRequestForClient paginationRequestForClient) {
        StatusObject<BaseNotificationAndPaginationDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            Pageable pageable = PageRequest.of(paginationRequestForClient.getPage(), 15);
            Page<Notification> notifications = notificationRepository.findNotificationByRecipientId(user.getId(),
                    pageable);
            if (notifications.isEmpty()) {
                statusObject.setErrorMessage("Notification not found");
                return statusObject;
            }

            List<BaseNotificationResponseDto> notiDtos = new ArrayList<>();
            for (Notification notification : notifications.getContent()) {
                NotificationType typeOfRequest = NotificationType.valueOf(notification.getType());
                if(typeOfRequest == NotificationType.SUBSCRIPTION) {
                    notiDtos.add(getNotificationForAboutToExpiredSubscriptionDto(notification));
                    continue;
                }
                User sender = notification.getSender();
                if (sender == null) {
                    continue;
                }
                UserSummaryDto senderDto = FileMapper.getUserSummaryDto(sender);
                senderDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, senderDto.getAvatar()));
                if (typeOfRequest == NotificationType.FOLLOW_REQUEST || typeOfRequest == NotificationType.ACCEPTED) {
                    notiDtos.add(getNotificationResponseForAcceptOrFollowDto(
                            notification,
                            senderDto));
                } else if (typeOfRequest == NotificationType.LIKE) {
                    CreateNotificationRequest.PayloadForLikeYourPost payloadForLikeYourPost = new CreateNotificationRequest.PayloadForLikeYourPost(
                            notification.getReferenceId().toString());
                    if (getNotificationResponseForLikeYourPostDto(
                            notification,
                            payloadForLikeYourPost,
                            senderDto) != null) {
                        notiDtos.add(getNotificationResponseForLikeYourPostDto(
                                notification,
                                payloadForLikeYourPost,
                                senderDto));
                    }
                } else if (typeOfRequest == NotificationType.COMMENT
                        || typeOfRequest == NotificationType.REPLY_COMMENT) {
                    UUID childReferenceId = notification.getChildReferenceId();
                    Comment comment = commentRepository.findCommentById(childReferenceId);
                    if (comment == null) {
                        continue;
                    }
                    CommentResponseDto commentResponseDto = CommentResponseDto.builder()
                            .id(comment.getId().toString())
                            .content(comment.getContent())
                            .sender(senderDto)
                            .imageId(comment.getImage().getId().toString())
                            .imageUrl(comment.getImage()
                                    .getImageUrl())
                            .parentId(comment.getParentId() == null ? null : comment.getParentId().toString())
                            .createdDate(comment.getCreatedDate())
                            .like(comment.getLikeCount())
                            .build();
                    notiDtos.add(getNotificationResponseForCommentOrReplyDto(
                            notification,
                            new CreateNotificationRequest.PayloadForCommentYourPost(commentResponseDto)));
                
                } else if (typeOfRequest == NotificationType.SALE_IMAGE) {
                    CreateNotificationRequest.PayloadForSaleImage payloadForSaleImage = new CreateNotificationRequest.PayloadForSaleImage(
                            notification.getReferenceId().toString());
                    if (getNotificationResponseForSaleImageDto(
                            notification,
                            payloadForSaleImage, senderDto) != null) {
                        notiDtos.add(getNotificationResponseForSaleImageDto(
                                notification,
                                payloadForSaleImage,
                                senderDto));
                    }
                }

            }
            if (!notiDtos.isEmpty()) {
                notiDtos.sort(
                        Comparator.comparing(
                                BaseNotificationResponseDto::getNotificationCreatedDate
                        ).reversed()
                );
            }
            statusObject.setSuccess(true);
            statusObject.setData(new BaseNotificationAndPaginationDto(
                    notifications.getTotalPages() - 1,
                    notiDtos));
            return statusObject;
        } catch (Exception e) {
            e.printStackTrace();
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public Status deleteNotification(
            String userEmail,
            String notificationId) {
        Status status = new Status(false, "", "");
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                status.setErrorMessage("User not found");
                return status;
            }
            Notification notification = notificationRepository.findNotificationById(UUID.fromString(notificationId));
            if (notification == null) {
                status.setErrorMessage("Notification not found");
                return status;
            }
            notificationRepository.delete(notification);
            status.setIsSuccess(true);
            status.setMessage("Notification deleted successfully");
            return status;

        } catch (Exception e) {
            e.printStackTrace();
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    private NotificationResponseForLikeYourPostDto getNotificationResponseForLikeYourPostDto(
            Notification notification,
            CreateNotificationRequest.PayloadForLikeYourPost payloadForLikeYourPost,
            UserSummaryDto sender) {
        Image image = imageRepository.findById(UUID.fromString(payloadForLikeYourPost.getImageId())).orElse(null);
        if (image == null) {
            return null;
        }
        NotificationResponseForLikeYourPostDto notiDtos = new NotificationResponseForLikeYourPostDto();
        notiDtos.setRead(notification.isRead());
        notiDtos.setId(notification.getId().toString());
        notiDtos.setSender(sender);
        notiDtos.setType(NotificationType.LIKE);
        notiDtos.setImageId(image.getId().toString());
        notiDtos.setImage(FileHelper.getImageUrl(cloudinary, image.getImageUrl()));
        notiDtos.setNotificationCreatedDate(notification.getCreatedDate());
        return notiDtos;
    }

    private NotificationResponseForSaleImageDto getNotificationResponseForSaleImageDto(
            Notification notification,
            CreateNotificationRequest.PayloadForSaleImage payloadForSaleImage,
            UserSummaryDto sender) {
        Image image = imageRepository.findById(UUID.fromString(payloadForSaleImage.getImageId())).orElse(null);
        if (image == null) {
            return null;
        }
        NotificationResponseForSaleImageDto notiDtos = new NotificationResponseForSaleImageDto();
        notiDtos.setRead(notification.isRead());
        notiDtos.setId(notification.getId().toString());
        notiDtos.setSender(sender);
        notiDtos.setType(NotificationType.SALE_IMAGE);
        notiDtos.setImageId(image.getId().toString());
        notiDtos.setImage(FileHelper.getImageUrl(cloudinary, image.getImageUrl()));
        notiDtos.setNotificationCreatedDate(notification.getCreatedDate());
        return notiDtos;
    }

    private NotificationResponseForAcceptOrFollowDto getNotificationResponseForAcceptOrFollowDto(
            Notification notification,
            UserSummaryDto sender) {
        String content;
        NotificationType type;
        if (notification.getType()
                .equalsIgnoreCase(NotificationType.FOLLOW_REQUEST.toString())) {
            if (notification.getRecipient()
                    .isPublic()) {
                content = "started following you";
                type = NotificationType.ACCEPTED;
            } else {
                content = "sent you a follow request";
                type = NotificationType.FOLLOW_REQUEST;
            }
        } else {
            content = "accepted your follow request";
            type = NotificationType.ACCEPTED;
        }
        NotificationResponseForAcceptOrFollowDto notiDtos = new NotificationResponseForAcceptOrFollowDto();
        notiDtos.setRead(notification.isRead());
        notiDtos.setId(notification.getId().toString());
        notiDtos.setContent(content);
        notiDtos.setSender(sender);
        notiDtos.setNotificationCreatedDate(notification.getCreatedDate());
        notiDtos.setType(type);
        return notiDtos;
    }

    private NotificationResponseForCommentOrReplyDto getNotificationResponseForCommentOrReplyDto(
            Notification notification,
            CreateNotificationRequest.PayloadForCommentYourPost payloadForCommentYourPost) {
        NotificationResponseForCommentOrReplyDto notiDtos = new NotificationResponseForCommentOrReplyDto();
        NotificationType type;
        if (payloadForCommentYourPost.getComment().getParentId() == null) {
            type = NotificationType.COMMENT;
        } else {
            type = NotificationType.REPLY_COMMENT;
        }
        String imageUrl = payloadForCommentYourPost.getComment().getImageUrl();
        payloadForCommentYourPost.getComment().setImageUrl(FileHelper.getImageUrl(cloudinary, imageUrl));
        String avatarUrl = payloadForCommentYourPost.getComment().getSender().getAvatar();
        payloadForCommentYourPost.getComment().getSender().setAvatar(FileHelper.getAvatarUrl(cloudinary, avatarUrl));
        notiDtos.setRead(notification.isRead());
        notiDtos.setId(notification.getId().toString());
        notiDtos.setType(type);
        notiDtos.setComment(payloadForCommentYourPost.getComment());
        notiDtos.setNotificationCreatedDate(notification.getCreatedDate());
        return notiDtos;
    }

    private NotificationResponseForAboutToExpiredSubscriptionDto getNotificationForAboutToExpiredSubscriptionDto(
            Notification notification) {
        NotificationResponseForAboutToExpiredSubscriptionDto notiDtos = new NotificationResponseForAboutToExpiredSubscriptionDto();
        notiDtos.setRead(notification.isRead());
        notiDtos.setId(notification.getId().toString());
        notiDtos.setContent(notification.getContent());
        notiDtos.setType(NotificationType.SUBSCRIPTION);
        notiDtos.setNotificationCreatedDate(notification.getCreatedDate());
        return notiDtos;
    }

    @Override
    public Status markAsReadAll(String userEmail) {
        Status status = new Status(false, "", "");
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                status.setErrorMessage("User not found");
                return status;
            }
            List<Notification> notifications = notificationRepository.findNotificationByRecipientId(user.getId());
            if (notifications.isEmpty()) {
                status.setErrorMessage("Notification not found");
                return status;
            }
            notifications.forEach(notification -> notification.setRead(true));
            notificationRepository.saveAll(notifications);

            status.setIsSuccess(true);
            status.setMessage("Mark as read all successfully");
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }
}
