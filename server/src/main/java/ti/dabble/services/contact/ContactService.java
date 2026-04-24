package ti.dabble.services.contact;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinary.Cloudinary;

import java.util.List;
import java.util.UUID;

import jakarta.annotation.Nullable;
import ti.dabble.dtos.BlockContactDto;
import ti.dabble.dtos.ContactResponseDto;
import ti.dabble.dtos.ConversationResponseForChatBoxDto;
import ti.dabble.dtos.TotalOfUnreadConversationAndConversationResponseForChatBoxDto;
import ti.dabble.entities.Contact;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.User;
import ti.dabble.enums.ContactRequestType;
import ti.dabble.enums.ContactStatus;
import ti.dabble.enums.ConversationType;
import ti.dabble.enums.NotificationType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.ConversationParticipantRepository;
import ti.dabble.repositories.MessageRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.requests.CreateFollowOrAcceptOrDenyRequest;
import ti.dabble.requests.CreateNotificationRequest;
import ti.dabble.requests.CreateUnfollowOrBlockOrUnblockUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.notification.INotificationService;

@Service
public class ContactService implements IContactService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private ConversationParticipantRepository conversationParticipantRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private RedisTemplate redisTemplate;

    @Transactional
    @Override
    public Status followOrAcceptOrDenyUser(
            CreateFollowOrAcceptOrDenyRequest createFollowOrAcceptOrDenyRequest,
            String senderEmail) {
        try {

            Status status = new Status(false, "", "");
            User sender = userRepository.findByEmail(senderEmail);
            if (sender == null) {
                status.setErrorMessage("User not found");
                return status;
            }
            User recipientRequest = userRepository.findByUsername(createFollowOrAcceptOrDenyRequest.getUsername());
            if (recipientRequest == null) {
                status.setErrorMessage("User to do this action not found");
                return status;
            }
            if (sender.getEmail()
                    .equalsIgnoreCase(recipientRequest.getEmail())) {
                status.setErrorMessage("You can not send request to yourself");
                return status;
            }
            boolean isBlocked = contactRepository.hasBlockedRelationship(sender.getId(), recipientRequest.getId());
            if (isBlocked) {
                status.setErrorMessage("You have blocked this user or vice versa");
                return status;
            }
            StatusObject<Object> notification;
            ContactRequestType typeOfRequest = createFollowOrAcceptOrDenyRequest.getTypeOfRequest();

            if (typeOfRequest == ContactRequestType.FOLLOW) {
                Contact existingContact = contactRepository.findByUserIdAndContactUserId(sender.getId(),
                        recipientRequest.getId());
                if (existingContact != null) {
                    if (existingContact.getStatus() == ContactStatus.ACCEPTED.getId()) {
                        status.setErrorMessage("You have followed this user");
                        return status;
                    } else if (existingContact.getStatus() == ContactStatus.PENDING.getId()) {
                        status.setErrorMessage(
                                "You have sent a follow request to this user. Please wait for their response");
                        return status;
                    }
                }

                Contact contact = new Contact();
                contact.setUser(sender);
                contact.setContactUser(recipientRequest);
                if (recipientRequest.isPublic()) {
                    contact.setStatus(ContactStatus.ACCEPTED.getId());
                } else {
                    contact.setStatus(ContactStatus.PENDING.getId());
                }

                String redisKey = "notif_cooldown:follow:" + sender.getId().toString() + ":"
                        + recipientRequest.getId().toString();
                Boolean isFirst = redisTemplate.opsForValue()
                        .setIfAbsent(redisKey, "notif_follow", Duration.ofMinutes(3));

                if (Boolean.TRUE.equals(isFirst)) {
                    CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
                    notificationRequest.setType(NotificationType.FOLLOW_REQUEST);
                    notificationRequest.setUserReceivingId(recipientRequest.getId().toString());
                    notificationRequest.setReferenceId(sender.getId().toString());
                    notification = notificationService.createNotification(
                            notificationRequest,
                            senderEmail);
                    if (!notification.isSuccess()) {
                        status.setErrorMessage(notification.getErrorMessage());
                    }
                }

                contactRepository.save(contact);
            } else if (typeOfRequest == ContactRequestType.ACCEPTED) {
                Contact pendingRequest = contactRepository.findByUserIdAndContactUserId(recipientRequest.getId(),
                        sender.getId());
                if (pendingRequest == null) {
                    status.setErrorMessage("Contact not found");
                    return status;
                }
                if (pendingRequest.getStatus() == ContactStatus.ACCEPTED.getId()) {
                    status.setErrorMessage("You could not accept because you have already followed them");
                    return status;
                }
                pendingRequest.setStatus(ContactStatus.ACCEPTED.getId());
                CreateNotificationRequest notificationRequest = new CreateNotificationRequest();
                notificationRequest.setType(NotificationType.ACCEPTED);
                notificationRequest.setUserReceivingId(recipientRequest.getId().toString());
                notificationRequest.setReferenceId(sender.getId().toString());
                notification = notificationService.createNotification(
                        notificationRequest,
                        senderEmail);
                if (!notification.isSuccess()) {
                    status.setErrorMessage(notification.getErrorMessage());
                }
                contactRepository.save(pendingRequest);

            } else if (typeOfRequest == ContactRequestType.DENY) {
                Contact pendingRequest = contactRepository.findByUserIdAndContactUserId(recipientRequest.getId(),
                        sender.getId());

                if (pendingRequest == null) {
                    status.setErrorMessage("Contact not found");
                    return status;
                }
                if (pendingRequest.getStatus() == ContactStatus.ACCEPTED.getId()) {
                    status.setErrorMessage("You could deny because you guys are already friends");
                    return status;
                }
                contactRepository.delete(pendingRequest);
            }

            status.setIsSuccess(true);
            status.setMessage("Follow or accept or deny successfully");
            return status;
        } catch (Exception e) {
            e.printStackTrace();
            Status status = new Status(false, "", "");
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    @Transactional
    public Status unfollowOrBlockOrUnblockUser(
            CreateUnfollowOrBlockOrUnblockUserRequest createUnfollowOrBlockOrUnblockUserRequest,
            String senderEmail) {
        Status status = new Status(false, "", "");
        User sender = userRepository.findByEmail(senderEmail);
        if (sender == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        User recipientRequest = userRepository.findByUsername(createUnfollowOrBlockOrUnblockUserRequest.getUsername());
        if (recipientRequest == null) {
            status.setErrorMessage("User to do this action not found");
            return status;
        }
        if (sender.getEmail()
                .equalsIgnoreCase(recipientRequest.getEmail())) {
            status.setErrorMessage("You can not remove yourself");
            return status;
        }
        if (createUnfollowOrBlockOrUnblockUserRequest.getTypeOfRequest() == ContactRequestType.UNFOLLOW) {
            boolean isBlockedByUser = contactRepository.hasBlockUser(recipientRequest.getId(), sender.getId());
            if (isBlockedByUser) {
                status.setErrorMessage("This user has blocked you so you already unfollowed them");
                return status;
            }
            Contact contact = contactRepository.findByUserIdAndContactUserId(sender.getId(), recipientRequest.getId());
            if (contact == null) {
                status.setErrorMessage("You are not following this user");
                return status;
            }
            if (contact.getStatus() == ContactStatus.BLOCKED.getId()) {
                status.setErrorMessage("You has blocked this user so you already unfollowed them");
                return status;
            }

            contactRepository.delete(contact);
            status.setMessage("Unfollowed this user successfully");
        } else if (createUnfollowOrBlockOrUnblockUserRequest.getTypeOfRequest() == ContactRequestType.BLOCK) {
            boolean hasBlockedUser = contactRepository.hasBlockUser(sender.getId(), recipientRequest.getId());
            if (hasBlockedUser) {
                status.setErrorMessage("You have blocked this user");
                return status;
            }
            Contact contactOfUser = contactRepository.findByUserIdAndContactUserId(sender.getId(),
                    recipientRequest.getId());

            if (contactOfUser == null) {
                contactOfUser = new Contact();
                contactOfUser.setUser(sender);
                contactOfUser.setContactUser(recipientRequest);

            }
            contactOfUser.setStatus(ContactStatus.BLOCKED.getId());
            contactRepository.save(contactOfUser);

            Contact contactOfRecipient = contactRepository.findByUserIdAndContactUserId(recipientRequest.getId(),
                    sender.getId());
            if (contactOfRecipient != null && contactOfRecipient.getStatus() != ContactStatus.BLOCKED.getId()) {
                contactRepository.delete(contactOfRecipient);
            }
            status.setMessage("Blocked this user successfully");
        } else if (createUnfollowOrBlockOrUnblockUserRequest.getTypeOfRequest() == ContactRequestType.UNBLOCK) {
            Contact blockRelationship = contactRepository.findByUserIdAndContactUserId(sender.getId(),
                    recipientRequest.getId());
            if (blockRelationship == null || blockRelationship.getStatus() != ContactStatus.BLOCKED.getId()) {
                status.setErrorMessage("You are not blocking this user");
                return status;
            }

            status.setIsSuccess(true);
            status.setMessage("Unblocked this user successfully");
            contactRepository.delete(blockRelationship);
        }
        ContactRequestType typeOfRequest = createUnfollowOrBlockOrUnblockUserRequest.getTypeOfRequest();
        if (typeOfRequest == ContactRequestType.FOLLOW || typeOfRequest == ContactRequestType.ACCEPTED
                || typeOfRequest == ContactRequestType.DENY) {
            status.setErrorMessage("Only can do block, unblock or unfollow action");
            return status;
        } else {
            List<ConversationParticipant> recipientParticipants = conversationParticipantRepository
                    .findByUserId(recipientRequest.getId());

            List<BlockContactDto> blockRelations = contactRepository.findAllBlockRelations(recipientRequest.getId());

            List<ConversationResponseForChatBoxDto> conversationResponseDtosOfRecipient = FileMapper
                    .getConversationResponseDtos(
                            recipientParticipants,
                            recipientRequest,
                            blockRelations,
                            messageRepository);

            int unreadConversations = (int) conversationParticipantRepository
                    .countUnreadConversations(recipientRequest.getId());

            ConversationResponseForChatBoxDto conversationOfUsers = conversationResponseDtosOfRecipient.stream().filter(
                    (dto) -> dto.getParticipants().contains(FileMapper.getUserSummaryDto(sender))
                            && dto.getType().equalsIgnoreCase(ConversationType.PRIVATE.toString()))
                    .findFirst().orElse(null);
            if (conversationOfUsers != null) {
                conversationOfUsers.getParticipants().stream().forEach((p) -> {
                    p.setAvatar(FileHelper.getAvatarUrl(cloudinary, p.getAvatar()));
                });
            }
            TotalOfUnreadConversationAndConversationResponseForChatBoxDto dto = new TotalOfUnreadConversationAndConversationResponseForChatBoxDto(
                    unreadConversations,
                    conversationOfUsers);

            if (dto.getConversationResponseForChatBoxDto() != null) {
                messagingTemplate.convertAndSendToUser(
                        recipientRequest.getEmail(),
                        "/queue/chat-updates",
                        dto);
            }
        }
        status.setIsSuccess(true);
        return status;
    }

    @Override
    public Status removeFollower(
            String username,
            String removerEmail) {
        Status status = new Status(false, "", "");
        try {
            User remover = userRepository.findByEmail(removerEmail);
            if (remover == null) {
                status.setErrorMessage("User not found");
                return status;
            }

            User follower = userRepository.findByUsername(username);
            if (follower == null) {
                status.setErrorMessage("Follower not found");
                return status;
            }
            if (remover.getEmail()
                    .equalsIgnoreCase(follower.getEmail())) {
                status.setErrorMessage("You can not remove yourself");
                return status;
            }
            Contact contactOfFollower = contactRepository.findByUserIdAndContactUserId(follower.getId(),
                    remover.getId());
            if (contactOfFollower == null || contactOfFollower.getStatus() != ContactStatus.ACCEPTED.getId()) {
                status.setErrorMessage("This user is not following this you");
                return status;
            }

            contactRepository.delete(contactOfFollower);
            status.setIsSuccess(true);
            status.setMessage("Removed follower successfully");
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<List<ContactResponseDto>> getAllFollowersOfUser(
            String targetUsername,
            @Nullable String authEmail) {
        StatusObject<List<ContactResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User targetUser = userRepository.findByUsername(targetUsername);
            if (targetUser == null) {
                statusObject.setErrorMessage("Target user not found");
                return statusObject;
            }
            List<Contact> contacts = contactRepository.findAllFollowerOfUser(targetUser.getId(),
                    ContactStatus.ACCEPTED.getId());
            if (contacts.isEmpty()) {
                statusObject.setMessage("No contact found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all contact successfully");
            }

            UUID authId = authEmail == null ? null
                    : userRepository.findByEmail(authEmail)
                            .getId();
            List<ContactResponseDto> contactResponseDtos = contacts.stream()
                    .map(c -> {
                        ContactStatus followStatus = ContactStatus.UNFOLLOW;
                        Contact contact = contactRepository.findByUserIdAndContactUserId(
                                authId,
                                c.getUser()
                                        .getId());
                        if (contact != null) {
                            if (contact.getStatus() == ContactStatus.PENDING.getId()) {
                                followStatus = ContactStatus.PENDING;
                            } else if (contact.getStatus() == 2) {
                                followStatus = ContactStatus.ACCEPTED;
                            } else if (contact.getStatus() == 3) {
                                followStatus = ContactStatus.BLOCKED;
                            }
                        }
                        return FileMapper.getContactResponseDto(cloudinary, c, followStatus);
                    })
                    .toList();
            statusObject.setData(contactResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ContactResponseDto>> getAllFollowingsOfUser(
            String targetUsername,
            @Nullable String authEmail) {
        StatusObject<List<ContactResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User targetUser = userRepository.findByUsername(targetUsername);
            if (targetUser == null) {
                statusObject.setErrorMessage("Target user not found");
                return statusObject;
            }
            List<Contact> contacts = contactRepository.findAllFollowingOfUser(targetUser.getId());
            if (contacts.isEmpty()) {
                statusObject.setMessage("No contact found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all contact successfully");
            }
            UUID authId = authEmail == null ? null
                    : userRepository.findByEmail(authEmail)
                            .getId();
            List<ContactResponseDto> contactResponseDtos = contacts.stream()
                    .map(c -> {
                        ContactStatus followStatus = ContactStatus.UNFOLLOW;
                        Contact contact = contactRepository.findByUserIdAndContactUserId(
                                authId,
                                c.getContactUser()
                                        .getId());
                        if (contact != null) {
                            if (contact.getStatus() == 1) {
                                followStatus = ContactStatus.PENDING;
                            } else if (contact.getStatus() == 2) {
                                followStatus = ContactStatus.ACCEPTED;
                            } else if (contact.getStatus() == 3) {
                                followStatus = ContactStatus.BLOCKED;
                            }
                        }
                        return ContactResponseDto.builder().username(c.getContactUser()
                                .getUsername())

                                .userId(c.getContactUser()
                                        .getId().toString())
                                .name(FileHelper.formatFullName(c.getContactUser().getFirstname(),
                                        c.getContactUser().getLastname()))
                                .avatar(FileHelper.getAvatarUrl(cloudinary, c.getContactUser()
                                        .getAvatar()))
                                .followStatus(followStatus)
                                .build();
                    })
                    .toList();
            statusObject.setData(contactResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ContactResponseDto>> getAllPendingOfUser(String userEmail) {
        StatusObject<List<ContactResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            List<Contact> contacts = contactRepository.findAllFollowerOfUser(user.getId(),
                    ContactStatus.PENDING.getId());
            if (contacts.isEmpty()) {
                statusObject.setMessage("No pending found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all contact successfully");
            }
            List<ContactResponseDto> contactResponseDtos = contacts.stream()
                    .map((c) -> FileMapper.getContactResponseDto(cloudinary, c, ContactStatus.PENDING))
                    .toList();
            statusObject.setData(contactResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<ContactResponseDto>> getAllBlockedOfUser(String userEmail) {
        StatusObject<List<ContactResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            List<Contact> contacts = contactRepository.findAllBlockedOfUser(user.getId());
            if (contacts.isEmpty()) {
                statusObject.setMessage("No blocked found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all contact successfully");
            }
            List<ContactResponseDto> contactResponseDtos = contacts.stream()
                    .map((c) -> ContactResponseDto.builder()
                            .username(c.getContactUser()
                                    .getUsername())
                            .userId(c.getContactUser()
                                    .getId().toString())
                            .name(FileHelper.formatFullName(c.getContactUser().getFirstname(),
                                    c.getContactUser().getLastname()))
                            .avatar(FileHelper.getAvatarUrl(cloudinary, c.getContactUser()
                                    .getAvatar()))
                            .build())
                    .toList();
            statusObject.setData(contactResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

}
