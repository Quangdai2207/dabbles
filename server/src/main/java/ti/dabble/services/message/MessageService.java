package ti.dabble.services.message;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinary.Cloudinary;

import ti.dabble.dtos.BlockContactDto;
import ti.dabble.dtos.ConversationResponseForChatBoxDto;
import ti.dabble.dtos.MessageResponseDto;
import ti.dabble.dtos.TotalOfUnreadConversationAndConversationResponseForChatBoxDto;
import ti.dabble.entities.Conversation;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.Message;
import ti.dabble.entities.User;
import ti.dabble.enums.ConversationType;
import ti.dabble.enums.MessageType;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.ContactRepository;
import ti.dabble.repositories.ConversationParticipantRepository;
import ti.dabble.repositories.ConversationRepository;
import ti.dabble.repositories.MessageRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.requests.SendMessageRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.conversation.IConversationService;

@Service
public class MessageService implements IMessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;
    @Autowired
    private ConversationParticipantRepository participantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private ConversationParticipantRepository conversationParticipantRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private IConversationService conversationService;
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    @Override
    public StatusObject<MessageResponseDto> sendMessage(
            SendMessageRequest sendMessageRequest,
            String senderEmail) {
        StatusObject<MessageResponseDto> statusObject = new StatusObject<>(false, "", "", null);
        User sender = userRepository.findByEmail(senderEmail);
        if (sender == null) {
            statusObject.setErrorMessage("User not found");
            return statusObject;
        }

        Conversation conversation = conversationRepository.findById(UUID.fromString(sendMessageRequest.getConversationId()))
                .orElse(null);
        if (conversation == null || conversation.isDeleted()) {
            statusObject.errorMessage = "This conversation do not exist";
            return statusObject;
        }

        ConversationParticipant senderParticipant = participantRepository
                .findByConversationIdAndUserId(UUID.fromString(sendMessageRequest.getConversationId()), sender.getId());

        if (senderParticipant == null) {
            statusObject.setErrorMessage("You are not a participant of this conversation");
            return statusObject;
        }
        if (senderParticipant.isLeft()) {
            statusObject.setErrorMessage("You have left this conversation and cannot send messages");
            return statusObject;
        }
        if (conversation.getType()
                .equalsIgnoreCase(ConversationType.PRIVATE.toString())) {

            ConversationParticipant recipientParticipant = conversation.getParticipants()
                    .stream()
                    .filter(p -> !p.getUser()
                            .getId()
                            .equals(sender.getId()))
                    .findFirst()
                    .orElse(null);

            if (recipientParticipant != null) {
                boolean isBlocked = contactRepository.hasBlockedRelationship(
                        sender.getId(),
                        recipientParticipant.getUser()
                                .getId());
                if (isBlocked) {
                    statusObject.setErrorMessage("You have been blocked by this user, or you blocked them");
                    return statusObject;
                }
            } else {
                statusObject.setErrorMessage(
                        "This conversation is private and only have one participant please delete it");
                return statusObject;
            }
        }

        Message message = new Message();
        message.initDefault();

        message.setConversationId(conversation.getId().toString());
        message.setSenderId(sender.getId().toString());

        message.setMessageType(MessageType.TEXT.toString());
        message.setContent(sendMessageRequest.getContent());

        messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        senderParticipant.setLastReadAt(LocalDateTime.now());
        participantRepository.save(senderParticipant);

        MessageResponseDto messageResponseDto = FileMapper.getMessageResponseDto(message, sender);

        String destination = "/topic/conversation/" + conversation.getId();
        messagingTemplate.convertAndSend(destination, messageResponseDto);

        List<ConversationParticipant> participants = conversation.getParticipants();
        List<BlockContactDto> blockContactDtos = contactRepository.findAllBlockRelations(sender.getId());
        for (ConversationParticipant p : participants) {
            User viewer = p.getUser();
            int unreadConversations = (int) conversationParticipantRepository.countUnreadConversations(viewer.getId());

            List<ConversationParticipant> singleParticipantList = Collections.singletonList(p);
            List<ConversationResponseForChatBoxDto> dtos = FileMapper
                    .getConversationResponseDtos(singleParticipantList, viewer, blockContactDtos, messageRepository);
            dtos.forEach((c) -> c.getParticipants().forEach((pt) -> pt.setAvatar(FileHelper.getAvatarUrl(cloudinary, pt.getAvatar()))));
            TotalOfUnreadConversationAndConversationResponseForChatBoxDto dtoForViewer = new TotalOfUnreadConversationAndConversationResponseForChatBoxDto(
                    unreadConversations, dtos.stream().findFirst().orElse(null));

            if (dtoForViewer.getConversationResponseForChatBoxDto() == null)
                continue;

            messagingTemplate.convertAndSendToUser(
                    viewer.getEmail(), "/queue/chat-updates", dtoForViewer);
        }

        statusObject.setSuccess(true);
        statusObject.setMessage("Send message successfully");
        statusObject.setData(messageResponseDto);
        return statusObject;

    }

    @Override
    public StatusObject<List<MessageResponseDto>> messageOfConversation(
            String userEmail,
            String conversationId,
            String cursor) {
        StatusObject<List<MessageResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        int PAGE_SIZE = 20;
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        User user = userRepository.findByEmail(userEmail);
        ConversationParticipant conversationParticipant = participantRepository
                .findByConversationIdAndUserId(UUID.fromString(conversationId), user.getId());

        if (conversationParticipant == null) {
            statusObject.setErrorMessage("You are not a participant of this conversation");
            return statusObject;
        }
        Conversation conversation = conversationRepository.findById(UUID.fromString(conversationId)).orElse(null);
        if (conversation == null) {
            statusObject.setMessage("This conversation do not exist");
            return statusObject;
        }

        Slice<Message> messageSlice;
        List<Message> messages;

        LocalDateTime deletedMessageAt = conversationParticipant.getDeletedMessageAt();

        if (deletedMessageAt == null) {
            if (cursor == null || cursor.isEmpty()) {
                // Lấy mới nhất, chưa xóa gì
                messageSlice = messageRepository.findByConversationId(conversationId, pageable);
            } else {
                // Load more cũ hơn cursor
                LocalDateTime cursorDate = LocalDateTime.parse(cursor);
                messageSlice = messageRepository.findMessageWithCursor(conversationId, cursorDate, pageable);
            }
        } else {
            // Nếu user đã từng xóa lịch sử chat
            if (conversation.getLastMessageAt() != null && deletedMessageAt.isAfter(conversation.getLastMessageAt())) {
                // Đã xóa hết, không còn tin nào mới hơn thời điểm xóa
                statusObject.setSuccess(true);
                statusObject.setMessage("No messages");
                statusObject.setData(new ArrayList<>());
                return statusObject;
            }

            if (cursor == null || cursor.isEmpty()) {
                // Lấy mới nhất nhưng phải mới hơn thời điểm xóa
                messageSlice = messageRepository.findMessageByDeleted(conversationId, deletedMessageAt, pageable);
            } else {
                // Load more cũ hơn cursor NHƯNG mới hơn thời điểm xóa
                LocalDateTime cursorDate = LocalDateTime.parse(cursor);
                messageSlice = messageRepository.findMessageWithCursorAndDeleted(conversationId, deletedMessageAt,
                        cursorDate, pageable);
            }
        }

        messages = messageSlice.getContent();

        if (messages.isEmpty()) {
            statusObject.setSuccess(true);
            statusObject.setMessage("This conversation do not have any message");
            statusObject.setData(new ArrayList<>());
            return statusObject;
        }

        Set<UUID> senderIds = messages.stream()
                .map((m) -> UUID.fromString(m.getSenderId()))
                .collect(Collectors.toSet());

        List<User> senders = userRepository.findAllById(senderIds);

        Map<UUID, User> userMap = senders.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        List<MessageResponseDto> messageResponseDtos = messages.stream()
                .map(message -> {
                    User senderInfo = userMap.get(UUID.fromString(message.getSenderId()));
                    if (senderInfo == null) {
                        senderInfo = new User();
                        senderInfo.setId(null);
                        senderInfo.setUsername("Unknown");
                        senderInfo.setEmail("Unknown");
                        senderInfo.setAvatar("Unknown");
                        senderInfo.setLastname("Unknown");
                        senderInfo.setFirstname("Unknown");
                    }
                    senderInfo.setAvatar(FileHelper.getAvatarUrl(cloudinary, senderInfo.getAvatar()));
                    return FileMapper.getMessageResponseDto(message, senderInfo);
                })
                .sorted(Comparator.comparing(MessageResponseDto::getCreatedDate))
                .collect(Collectors.toList());

        Status markAsReadStatus = conversationService.markAsRead(userEmail, conversationId);
        if (!markAsReadStatus.isSuccess) {
            System.out.println("Warning: Could not mark as read");
        }

        statusObject.setSuccess(true);
        statusObject.setMessage("Messages found");
        statusObject.setData(messageResponseDtos);
        return statusObject;

    }
}
