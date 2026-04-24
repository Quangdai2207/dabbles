package ti.dabble.services.conversation;

import ti.dabble.dtos.*;
import ti.dabble.entities.Conversation;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.Message;
import ti.dabble.entities.User;
import ti.dabble.enums.ConversationType;
import ti.dabble.enums.GroupRoleType;
import ti.dabble.enums.MessageType;
import ti.dabble.enums.Role;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.*;
import ti.dabble.requests.AddParticipantToConversationRequest;
import ti.dabble.requests.CreateConversationRequest;
import ti.dabble.requests.RemoveUserFromConversationRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinary.Cloudinary;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import ti.dabble.helpers.FileHelper;

@Service
public class ConversationService implements IConversationService {
    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private ConversationParticipantRepository conversationParticipantRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    @Override
    public StatusObject<ConversationResponseDto> createConversation(
            String creatorEmail,
            CreateConversationRequest createConversationRequest) {
        StatusObject<ConversationResponseDto> statusObject = new StatusObject<>(false, "", "", null);

        if (createConversationRequest.getUsernames() == null || createConversationRequest.getUsernames()
                .isEmpty()) {
            statusObject.setErrorMessage("Must choose at least one person");
            return statusObject;
        }

        User creator = userRepository.findByEmail(creatorEmail);
        if (creator == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }

        if (createConversationRequest.getUsernames()
                .contains(creator.getUsername())) {
            statusObject.setErrorMessage("You cannot invite yourself");
            return statusObject;
        }

        List<User> invitedUsers = userRepository
                .findAllByUsernameInAndIsDeletedFalse(createConversationRequest.getUsernames());
        if (invitedUsers.isEmpty()) {
            statusObject.setErrorMessage("Invited users not found");
            return statusObject;
        }

        List<User> validInvitedUsers = invitedUsers.stream()
                .filter(u -> !contactRepository.hasBlockedRelationship(u.getId(), creator.getId()))
                .toList();

        if (validInvitedUsers.isEmpty()) {
            statusObject.setErrorMessage("All invited users blocked you or not found");
            return statusObject;
        }

        Conversation conversation = new Conversation();

        if (validInvitedUsers.size() == 1) {
            User partner = validInvitedUsers.get(0);

            Conversation existingConversation = conversationRepository
                    .findExistingPrivateConversation(creator.getId(), partner.getId()).orElse(null);
            if (existingConversation != null) {
                statusObject.setErrorMessage("This conversation already exists");
                return statusObject;
            }
            conversation.setType(ConversationType.PRIVATE.toString());
        } else {

            conversation.setType(ConversationType.GROUP.toString());

            if (createConversationRequest.getName() == null || createConversationRequest.getName()
                    .trim()
                    .isEmpty()) {
                String defaultName = creator.getFirstname() + ", " +
                        validInvitedUsers.stream()
                                .map(User::getFirstname)
                                .collect(Collectors.joining(", "));
                conversation.setName(defaultName);
            } else {
                conversation.setName(createConversationRequest.getName());
            }
        }
        Conversation savedConversation = conversationRepository.save(conversation);
        List<ConversationParticipant> participants = new ArrayList<>();
        participants.add(addParticipant(savedConversation, creator, GroupRoleType.ADMIN.toString()));

        for (User user : validInvitedUsers) {
            participants.add(addParticipant(savedConversation, user, GroupRoleType.MEMBER.toString()));
        }
        savedConversation.setParticipants(participants);
        if (savedConversation.getType()
                .equalsIgnoreCase(ConversationType.GROUP.toString())) {
            createSystemMessage(savedConversation, creator, " created a group");
        }
        ConversationParticipant targetParticipant = participants.stream()
                .filter(p -> !p.getUser().getId().equals(creator.getId())).findFirst().orElse(null);

        ConversationResponseDto conversationResponseDto = modelMapper.map(conversation, ConversationResponseDto.class);
        if (targetParticipant != null && targetParticipant.getUser() != null) {
            conversationResponseDto.setName(
                    targetParticipant.getUser().getFirstname() + " " + targetParticipant.getUser().getLastname());
        }
        statusObject.setSuccess(true);
        statusObject.setMessage("Create conversation successfully");
        statusObject.setData(conversationResponseDto);

        return statusObject;

    }

    @Transactional
    @Override
    public StatusObject<ConversationResponseDto> addParticipantToConversation(
            String adminEmail,
            AddParticipantToConversationRequest addParticipantToConversationRequest) {
        StatusObject<ConversationResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        User admin = userRepository.findByEmail(adminEmail);
        if (admin == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }

        Conversation conversation = conversationRepository
                .findById(UUID.fromString(addParticipantToConversationRequest.getConversationId()))
                .orElse(null);
        if (conversation == null) {
            statusObject.setErrorMessage("Conversation not found");
            return statusObject;
        } else if (conversation.getType()
                .equalsIgnoreCase(ConversationType.PRIVATE.toString())) {
            statusObject.setErrorMessage("Could add anyone else because this conversation is private");
            return statusObject;
        }

        ConversationParticipant conversationParticipant = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        conversation.getId(),
                        admin.getId());
        if (conversationParticipant == null || conversationParticipant.isLeft()) {
            statusObject.setErrorMessage("You are not a participant of this conversation");
            return statusObject;
        } else if (!conversationParticipant.getRole()
                .equalsIgnoreCase(GroupRoleType.ADMIN.toString())) {
            statusObject.setErrorMessage("You are not an admin of this conversation");
            return statusObject;
        }

        User invitingUser = userRepository.findByEmail(addParticipantToConversationRequest.getUserEmail());
        if (invitingUser == null) {
            statusObject.setErrorMessage("Inviting user not found");
            return statusObject;
        }

        if (admin.getEmail()
                .equalsIgnoreCase(invitingUser.getEmail())) {
            statusObject.setErrorMessage("You can not add yourself to the conversation");
            return statusObject;
        }
        boolean isBlocked = contactRepository.hasBlockedRelationship(
                invitingUser.getId(),
                admin.getId());
        if (isBlocked) {
            statusObject.setErrorMessage("You could not add this user because you have blocked them or vice versa");
            return statusObject;
        }

        ConversationParticipant invitingUserConversationParticipant = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        conversation.getId(),
                        invitingUser.getId());
        if (invitingUserConversationParticipant != null) {
            if (!invitingUserConversationParticipant.isLeft()) {
                statusObject.setErrorMessage("This user is already a participant of this conversation");
                return statusObject;
            }
            invitingUserConversationParticipant.setLeft(false);
            invitingUserConversationParticipant.setJoinedAt(LocalDateTime.now());
            invitingUserConversationParticipant.setDeletedMessageAt(null);
            invitingUserConversationParticipant.setLastReadAt(LocalDateTime.now());
            conversationParticipantRepository.save(invitingUserConversationParticipant);

            createSystemMessage(
                    conversation,
                    invitingUser,
                    "is add to the group by " + admin.getFirstname() + " " + admin.getLastname());
        } else {
            addParticipant(conversation, invitingUser, GroupRoleType.MEMBER.toString());
            createSystemMessage(
                    conversation,
                    invitingUser,
                    "is add to the group by " + admin.getFirstname() + " " + admin.getLastname());
        }

        ConversationResponseDto conversationResponseDto = ConversationResponseDto.builder()
                .conversationId(conversation.getId().toString())
                .name(conversation.getName())
                .type(conversation.getType())
                .build();
        statusObject.setSuccess(true);
        statusObject.setMessage("Add participant successfully");
        statusObject.setData(conversationResponseDto);
        return statusObject;

    }

    @Override
    public StatusObject<List<ConversationResponseForChatBoxDto>> findAllConversationOfUser(
            String userEmail) {
        StatusObject<List<ConversationResponseForChatBoxDto>> statusObject = new StatusObject<>(
                false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            List<ConversationParticipant> conversationParticipants = conversationParticipantRepository
                    .findByUserId(user.getId());
            if (conversationParticipants == null || conversationParticipants.isEmpty()) {
                statusObject.setSuccess(false);
                statusObject.setMessage("There is no conversation");
                statusObject.setData(null);
                return statusObject;
            }
            List<BlockContactDto> findAllBlockRelations = contactRepository.findAllBlockRelations(user.getId());
            List<ConversationResponseForChatBoxDto> conversationResponseDtos = FileMapper.getConversationResponseDtos(
                    conversationParticipants, user, findAllBlockRelations, messageRepository);
            conversationResponseDtos.forEach(
                    (c) ->
                    {
                        c.setAvatar(FileHelper.getAvatarUrl(cloudinary, c.getAvatar()));
                        c.getParticipants()
                                .forEach((p) ->
                                        p.setAvatar(FileHelper.getAvatarUrl(cloudinary, p.getAvatar())
                                        ));
                    });
            statusObject.setSuccess(true);
            statusObject.setMessage("Find all conversation of user successfully");
            statusObject.setData(conversationResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    public Status markAsRead(
            String userEmail,
            String conversationId) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        List<ConversationParticipant> participants = conversationParticipantRepository
                .findByConversationId(UUID.fromString(conversationId));
        if (participants.isEmpty()) {
            status.setErrorMessage("This conversation of user does not exist");
            return status;
        }
        ConversationParticipant readerParticipant = conversationParticipantRepository
                .findByConversationIdAndUserId(UUID.fromString(conversationId), user.getId());
        if (readerParticipant == null) {
            status.setErrorMessage("This conversation of user does not exist");
            return status;
        }
        readerParticipant.setLastReadAt(LocalDateTime.now());
        conversationParticipantRepository.save(readerParticipant);
        int totalUnreadConversations = (int) conversationParticipantRepository.countUnreadConversations(user.getId());
        ConversationReadDto readDto = ConversationReadDto.builder()
                .totalUnreadConversations(totalUnreadConversations)
                .conversationId(conversationId)
                .userId(user.getId().toString())
                .lastReadAt(readerParticipant.getLastReadAt())
                .isRead(true)
                .build();
        for (ConversationParticipant participant : participants) {
            if (participant.getUser().getId().equals(user.getId())) {
                messagingTemplate.convertAndSendToUser(
                        participant.getUser()
                                .getEmail(),
                        "/queue/read",
                        readDto);
            }
        }

        status.setIsSuccess(true);
        status.setMessage("Mark as read successfully");
        return status;
    }

    private ConversationParticipant addParticipant(
            Conversation conv,
            User user,
            String role) {
        ConversationParticipant participant = new ConversationParticipant();
        participant.setConversation(conv);
        participant.setUser(user);
        participant.setRole(role);
        participant.setJoinedAt(LocalDateTime.now());

        return conversationParticipantRepository.save(participant);
    }

    public StatusObject<ConversationResponseDto> findExistingPrivateConversation(
            String senderEmail,
            String otherUsername) {
        StatusObject<ConversationResponseDto> status = new StatusObject<>(false, "", "", null);
        try {
            User senderUser = userRepository.findByEmail(senderEmail);
            if (senderUser == null) {
                status.setErrorMessage("User not found");
                return status;
            }

            User otherUser = userRepository.findByUsername(otherUsername);
            if (otherUser == null) {
                status.setErrorMessage("User not found");
                return status;
            }
            if (senderEmail.equalsIgnoreCase(otherUser.getEmail())) {
                status.setErrorMessage("You cannot find conversation with yourself");
                return status;
            }
            Conversation conversation = conversationRepository.findExistingPrivateConversation(
                            senderUser.getId(), otherUser.getId())
                    .orElse(null);
            if (conversation == null) {
                status.setMessage("Conversation not found");
                return status;
            }
            ConversationResponseDto conversationResponseDto = modelMapper.map(conversation,
                    ConversationResponseDto.class);
            status.setData(conversationResponseDto);
            status.setMessage("Conversation found");
            status.setSuccess(true);

            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }

    }

    @Transactional
    @Override
    public Status deleteMessageHistoryOfConversation(
            String conversationId,
            String userEmail) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        Conversation conversation = conversationRepository.findById(UUID.fromString(conversationId))
                .orElse(null);
        if (conversation == null) {
            status.setErrorMessage("Conversation not found");
            return status;
        }
        ConversationParticipant memberOfConversation = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        UUID.fromString(conversationId),
                        user.getId());

        if (memberOfConversation == null || memberOfConversation.isLeft()) {
            status.setErrorMessage("You are not in this conversation");
            return status;
        }
        memberOfConversation.setDeletedMessageAt(LocalDateTime.now());
        memberOfConversation.setLastReadAt(LocalDateTime.now());
        conversationParticipantRepository.save(memberOfConversation);
        status.setIsSuccess(true);
        status.setMessage("Delete message successfully");
        return status;
    }

    @Transactional
    @Override
    public Status leaveConversation(
            String userEmail,
            String conversationId) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }
        Conversation conversation = conversationRepository.findById(UUID.fromString(conversationId))
                .orElse(null);
        if (conversation == null) {
            status.setErrorMessage("Conversation not found");
            return status;
        }
        if (!conversation.getType()
                .equalsIgnoreCase(ConversationType.GROUP.toString())) {
            status.setErrorMessage("Could not leave because this conversation is not GROUP");
            return status;
        }
        ConversationParticipant memberOfConversation = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        UUID.fromString(conversationId),
                        user.getId());

        if (memberOfConversation == null || memberOfConversation.isLeft()) {
            status.setErrorMessage("You are not in this conversation");
            return status;
        }
        if (memberOfConversation.getRole()
                .equalsIgnoreCase(Role.ADMIN.toString())) {
            List<ConversationParticipant> activeMembers = conversation.getParticipants()
                    .stream()
                    .filter(p -> !p.isLeft())
                    .toList();
            if (activeMembers.size() == 1) {
                conversation.setDeleted(true);
                conversationRepository.save(conversation);

                memberOfConversation.setLeft(true);
                conversationParticipantRepository.save(memberOfConversation);

                status.setIsSuccess(true);
                status.setMessage("Group deleted because you were the last member");
                return status;
            } else {
                ConversationParticipant newAdmin = activeMembers.stream()
                        .filter(p -> !p.getUser()
                                .getId()
                                .equals(user.getId()))
                        .findFirst()
                        .orElse(null);

                if (newAdmin != null) {
                    newAdmin.setRole(GroupRoleType.ADMIN.toString());
                    memberOfConversation.setRole(GroupRoleType.MEMBER.toString());
                    conversationParticipantRepository.save(newAdmin);

                    createSystemMessage(conversation, newAdmin.getUser(), " is now the new Admin.");
                }
            }
        }
        memberOfConversation.setLeft(true);
        conversationParticipantRepository.save(memberOfConversation);

        createSystemMessage(conversation, user, " leave the group");
        status.setIsSuccess(true);
        status.setMessage("Leave conversation successfully");
        return status;
    }

    @Transactional
    @Override
    public Status removeUserFromConversation(
            String userEmail,
            RemoveUserFromConversationRequest removeUserFromConversationRequest) {
        Status status = new Status(false, "", "");
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            status.setErrorMessage("User not found");
            return status;
        }

        User targetUser = userRepository.findByEmail(removeUserFromConversationRequest.getTargetUserEmail());
        if (targetUser == null) {
            status.setErrorMessage("Target user not found");
            return status;
        }

        if (user.getEmail()
                .equalsIgnoreCase(targetUser.getEmail())) {
            status.setErrorMessage("You cannot remove yourself");
            return status;
        }

        Conversation conversation = conversationRepository
                .findById(UUID.fromString(removeUserFromConversationRequest.getConversationId()))
                .orElse(null);
        if (conversation == null) {
            status.setErrorMessage("Conversation not found");
            return status;
        }
        if (!conversation.getType()
                .equalsIgnoreCase(ConversationType.GROUP.toString())) {
            status.setErrorMessage("Could not remove this user because this conversation is not GROUP");
            return status;
        }
        ConversationParticipant memberOfConversation = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        UUID.fromString(removeUserFromConversationRequest.getConversationId()),
                        user.getId());

        if (memberOfConversation == null || memberOfConversation.isLeft()) {
            status.setErrorMessage("You are not in this conversation");
            return status;
        }

        ConversationParticipant targetOfConversation = conversationParticipantRepository
                .findByConversationIdAndUserId(
                        UUID.fromString(removeUserFromConversationRequest.getConversationId()),
                        targetUser.getId());
        if (targetOfConversation == null || targetOfConversation.isLeft()) {
            status.setErrorMessage("Target user is not in this conversation");
            return status;
        }
        if (!memberOfConversation.getRole()
                .equalsIgnoreCase(Role.ADMIN.toString())) {
            status.setErrorMessage("You must be admin to remove someone");
            return status;
        }
        targetOfConversation.setLeft(true);

        conversationParticipantRepository.save(targetOfConversation);

        createSystemMessage(
                conversation,
                user,
                " remove " + targetUser.getFirstname() + " " + targetUser.getLastname() + " from the group");
        status.setIsSuccess(true);
        status.setMessage("Remove user successfully");
        return status;
    }

    private void createSystemMessage(
            Conversation conversation,
            User user,
            String actionMessage) {
        Message sysMsg = new Message();
        sysMsg.initDefault();
        sysMsg.setConversationId(conversation.getId().toString());
        sysMsg.setSenderId(user.getId().toString());
        sysMsg.setMessageType(MessageType.SYSTEM.toString());
        sysMsg.setContent(user.getFirstname() + " " + user.getLastname() + actionMessage);
        sysMsg.setCreatedDate(LocalDateTime.now());

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        Message savedMessage = messageRepository.save(sysMsg);
        UserSummaryDto senderDto = FileMapper.getUserSummaryDto(user);
        senderDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, senderDto.getAvatar()));
        MessageResponseDto messageResponseDto = MessageResponseDto.builder()
                .id(savedMessage.getId())
                .content(savedMessage.getContent())
                .messageType(savedMessage.getMessageType())
                .createdDate(savedMessage.getCreatedDate())
                .conversationId(conversation.getId().toString())
                .sender(senderDto)
                .build();
        messagingTemplate.convertAndSend("/topic/conversation/" + conversation.getId(), messageResponseDto);

        List<ConversationParticipant> participants = conversation.getParticipants();
        for (ConversationParticipant p : participants) {
            messagingTemplate.convertAndSendToUser(
                    p.getUser()
                            .getEmail(), // Email dùng để định danh User
                    "/queue/chat-updates",
                    messageResponseDto);
        }
    }

    @Override
    public StatusObject<Integer> getTotalOfUnreadConversation(String userEmail) {
        StatusObject<Integer> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            int unreadConversations = (int) conversationParticipantRepository.countUnreadConversations(user.getId());
            statusObject.setSuccess(true);
            statusObject.setMessage("Get total of unread conversations successfully");
            statusObject.setData(unreadConversations);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }
}
