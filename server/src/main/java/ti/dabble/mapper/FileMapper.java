package ti.dabble.mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.cloudinary.Cloudinary;

import ti.dabble.dtos.BlockContactDto;
import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.dtos.ContactResponseDto;
import ti.dabble.dtos.ConversationResponseForChatBoxDto;
import ti.dabble.dtos.MessageResponseDto;
import ti.dabble.dtos.UserSubscriptionResponseDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.dtos.WalletResponseDto;
import ti.dabble.dtos.WalletResponseForAdminDto;
import ti.dabble.dtos.WalletTransactionResponseDto;
import ti.dabble.entities.Category;
import ti.dabble.entities.Wallet;
import ti.dabble.entities.Comment;
import ti.dabble.entities.Contact;
import ti.dabble.entities.Conversation;
import ti.dabble.entities.ConversationParticipant;
import ti.dabble.entities.Message;
import ti.dabble.entities.User;
import ti.dabble.entities.UserSubscription;
import ti.dabble.entities.WalletTransaction;
import ti.dabble.enums.BlockStatus;
import ti.dabble.enums.ContactStatus;
import ti.dabble.enums.ConversationType;
import ti.dabble.enums.SubscriptionStatus;
import ti.dabble.helpers.FileHelper;
import ti.dabble.repositories.MessageRepository;

public class FileMapper {

    public static CommentResponseDto getCommentResponseDto(Comment comment) {
        String parentId;
        if (comment.getParentId() == null) {
            parentId = null;
        } else {
            parentId = comment.getParentId().toString();
        }
        UserSummaryDto senderDto = getUserSummaryDto(comment.getUser());
        return CommentResponseDto.builder()
                .id(comment.getId().toString())
                .content(comment.getContent())
                .sender(senderDto)
                .imageId(comment.getImage().getId().toString())
                .imageUrl(comment.getImage().getImageUrl())
                .parentId(parentId)
                .createdDate(comment.getCreatedDate())
                .like(comment.getLikeCount())
                .build();
    }

    public static UserSummaryDto getUserSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId().toString())
                .username(user.getUsername())
                .name(user.getFirstname() + " " + user.getLastname())
                .avatar(user.getAvatar())
                .build();
    }

    public static UserSubscriptionResponseDto getUserSubscriptionResponseDto(
            UserSubscription userSubscription) {
        UserSummaryDto userDto = getUserSummaryDto(userSubscription.getUser());
        int statusOfSub = userSubscription.getStatus();
        SubscriptionStatus status = statusOfSub == 1 ? SubscriptionStatus.ACTIVE
                : (statusOfSub == 2 ? SubscriptionStatus.EXPIRED : SubscriptionStatus.CANCELED);
        return UserSubscriptionResponseDto.builder()
                .user(userDto)
                .planDurationDays(userSubscription.getPlanDurationDays())
                .planPrice(userSubscription.getPlan()
                        .getPrice())
                .startDate(userSubscription.getStartDate())
                .endDate(userSubscription.getEndDate())
                .status(status)
                .createdDate(userSubscription.getCreatedDate())
                .build();
    }

    public static MessageResponseDto getMessageResponseDto(Message message, User user) {
        UserSummaryDto userSummaryDto = getUserSummaryDto(user);
        return MessageResponseDto.builder()
                .id(message.getId())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .createdDate(message.getCreatedDate())
                .conversationId(message.getConversationId())
                .sender(userSummaryDto)
                .build();
    }

    public static WalletTransactionResponseDto getWalletTransactionResponseDto(
            WalletTransaction walletTransaction) {
        return WalletTransactionResponseDto.builder()
                .id(walletTransaction.getId().toString())
                .amount(walletTransaction.getAmount())
                .type(walletTransaction.getType())
                .feeAmount(walletTransaction.getFeeAmount())
                .feePercent(walletTransaction.getFeePercent())
                .description(walletTransaction.getDescription())
                .netReceivedAmount(walletTransaction.getNetReceivedAmount() == null ? BigDecimal.ZERO
                        : walletTransaction.getNetReceivedAmount())
                .balanceAfter(walletTransaction.getBalanceAfter())
                .createdDate(walletTransaction.getCreatedDate())
                .build();
    }


    public static CategoryResponseDto getCategoryResponseDto(Category category) {
        return CategoryResponseDto.builder()
                .id(category.getId().toString())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .isFeatured(category.isFeatured())
                .build();
    }

    public static WalletResponseForAdminDto getWalletResponseForAdminDto(Wallet wallet) {
        UserSummaryDto userSummary = getUserSummaryDto(wallet.getUser());
        return WalletResponseForAdminDto.builder()
                .user(userSummary)
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .build();
    }

    public static List<ConversationResponseForChatBoxDto> getConversationResponseDtos(
            List<ConversationParticipant> conversationParticipants, User user,
            List<BlockContactDto> blockContactDtos, MessageRepository messageRepository) {
        return conversationParticipants.stream()
                .filter(participant -> {
                    Conversation conversation = participant.getConversation();
                    if (participant.isLeft())
                        return false;
                    if (conversation.getLastMessageAt() == null)
                        return false;
                    if (conversation.isDeleted())
                        return false;
                    if (participant.getDeletedMessageAt() != null) {
                        return participant.getDeletedMessageAt()
                                .isBefore(conversation.getLastMessageAt());
                    }
                    return true;
                })
                .map(participant -> {
                    int unreadMessageCount = 0;
                    Conversation conv = participant.getConversation();
                    LocalDateTime countFrom = participant.getLastReadAt();
                    Message lastMessage = messageRepository
                            .findTopByConversationId(conv.getId().toString());
                    List<Message> messageOfConversation = null;
                    // Neu ma thoi gian doc tin nhan cuoi cung sau thoi gian xoa tin nhan thi phai
                    // dem tu thoi gian xoa tin nhan
                    if (participant.getDeletedMessageAt() != null
                            && participant.getDeletedMessageAt()
                            .isAfter(countFrom)
                            && lastMessage != null) {
                        countFrom = participant.getDeletedMessageAt();
                    }

                    if (countFrom.isBefore(conv.getLastMessageAt())
                            && lastMessage != null) {

                        unreadMessageCount = (int) messageRepository.findMessageByConversationIdAndCreatedDateAfter(conv.getId().toString(), countFrom)
                                .stream()
                                .filter(m -> !m.getSenderId().equalsIgnoreCase(participant.getUser().getId().toString()))
                                .count();
                    }
                    String lastMessageContent = "";
                    String lastSenderId = "";
                    if (lastMessage != null && lastMessage.getSenderId() != null) {
                        lastMessageContent = lastMessage.getContent() != null
                                ? lastMessage.getContent()
                                : "";
                        lastSenderId = lastMessage.getSenderId().toString();
                    }

                    String finalLastSenderId = lastSenderId;
                    String avatarOfConversation = conv.getAvatar();
                    String nameOfConversation = conv.getName();
                    BlockStatus blockStatus = BlockStatus.NONE;
                    if (conv.getType()
                            .equalsIgnoreCase(ConversationType.PRIVATE.name())) {
                        ConversationParticipant targetParticipant = conv.getParticipants()
                                .stream()
                                .filter((p) -> !p.getUser()
                                        .getId()
                                        .equals(user.getId()))
                                .findFirst()
                                .orElse(null);
                        if (targetParticipant != null && targetParticipant.getUser() != null) {
                            if (blockContactDtos != null && !blockContactDtos.isEmpty()) {
                                BlockContactDto blockRelationship = blockContactDtos
                                        .stream()
                                        .filter(b -> b.getUserId().equals(
                                                targetParticipant
                                                        .getUser()
                                                        .getId()))
                                        .findFirst()
                                        .orElse(null);
                                if (blockRelationship != null) {
                                    blockStatus = blockRelationship
                                            .getBlockStatus();
                                }
                            }
                            avatarOfConversation = targetParticipant.getUser()
                                    .getAvatar();
                            nameOfConversation = targetParticipant.getUser()
                                    .getFirstname() + " "
                                    + targetParticipant.getUser()
                                    .getLastname();
                        }

                    }

                    List<UserSummaryDto> participantDtos = conv.getParticipants()
                            .stream()
                            .map(p -> FileMapper.getUserSummaryDto(p.getUser()))
                            .sorted((u1, u2) -> {
                                if (u1.getId().toString()
                                        .equalsIgnoreCase(finalLastSenderId)) {
                                    return -1;
                                } else if (u2.getId().toString()
                                        .equalsIgnoreCase(finalLastSenderId)) {
                                    return 1;
                                }
                                return 0;
                            })
                            .toList();

                    return ConversationResponseForChatBoxDto.builder()
                            .id(conv.getId().toString())
                            .name(nameOfConversation)
                            .type(conv.getType())
                            .avatar(avatarOfConversation)
                            .lastMessage(lastMessageContent)
                            .lastMessageAt(conv.getLastMessageAt())
                            .unreadMessageCount(unreadMessageCount)
                            .participants(participantDtos)
                            .blockStatus(blockStatus)
                            .createdAt(conv.getCreatedDate())
                            .build();
                })
                .sorted((c1, c2) -> c2.getLastMessageAt()
                        .compareTo(c1.getLastMessageAt())) // Sap xep doan chat moi nhat len
                // tren
                .toList();
    }

    public static ContactResponseDto getContactResponseDto(Cloudinary cloudinary, Contact c,
                                                           ContactStatus followStatus) {
        return ContactResponseDto.builder().username(c.getUser()
                        .getUsername())

                .userId(c.getUser()
                        .getId().toString())
                .name(FileHelper.formatFullName(c.getUser().getFirstname(), c.getUser().getLastname()))
                .avatar(FileHelper.getAvatarUrl(cloudinary, c.getUser()
                        .getAvatar()))
                .followStatus(followStatus)
                .build();
    }

}
