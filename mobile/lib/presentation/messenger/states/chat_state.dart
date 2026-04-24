import 'package:equatable/equatable.dart';
import '../../../features/chat/domain/entities/chat_entity.dart';

enum ChatStatus { initial, loading, success, error }

class ConversationState extends Equatable {
  const ConversationState({
    this.conversations = const <ConversationEntity>[],
    this.status = ChatStatus.initial,
    this.errorMessage = '',
    this.totalUnreadCount = 0,
    this.statusCode,
  });

  final List<ConversationEntity> conversations;
  final ChatStatus status;
  final String errorMessage;
  final int totalUnreadCount;
  final int? statusCode;

  bool get isNotFound => statusCode == 404 || statusCode == 400;

  ConversationState copyWith({
    List<ConversationEntity>? conversations,
    ChatStatus? status,
    String? errorMessage,
    int? totalUnreadCount,
    int? statusCode,
  }) {
    return ConversationState(
      conversations: conversations ?? this.conversations,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      totalUnreadCount: totalUnreadCount ?? this.totalUnreadCount,
      statusCode: statusCode ?? this.statusCode,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    conversations,
    status,
    errorMessage,
    totalUnreadCount,
    statusCode,
  ];
}

class ChatDetailState extends Equatable {
  const ChatDetailState({
    this.messages = const <ChatMessageEntity>[],
    this.status = ChatStatus.initial,
    this.errorMessage = '',
    this.cursor,
    this.hasMore = true,
    this.conversationId,
    this.otherUser,
    this.blockStatus = 'NONE',
    this.statusCode,
  });

  final List<ChatMessageEntity> messages;
  final ChatStatus status;
  final String errorMessage;
  final String? cursor;
  final bool hasMore;
  final String? conversationId;
  final ParticipantEntity? otherUser;
  final String blockStatus;
  final int? statusCode;

  bool get isNotFound => statusCode == 404 || statusCode == 400;

  ChatDetailState copyWith({
    List<ChatMessageEntity>? messages,
    ChatStatus? status,
    String? errorMessage,
    String? cursor,
    bool? hasMore,
    String? conversationId,
    ParticipantEntity? otherUser,
    String? blockStatus,
    int? statusCode,
  }) {
    return ChatDetailState(
      messages: messages ?? this.messages,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      cursor: cursor ?? this.cursor,
      hasMore: hasMore ?? this.hasMore,
      conversationId: conversationId ?? this.conversationId,
      otherUser: otherUser ?? this.otherUser,
      blockStatus: blockStatus ?? this.blockStatus,
      statusCode: statusCode ?? this.statusCode,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    messages,
    status,
    errorMessage,
    cursor,
    hasMore,
    conversationId,
    otherUser,
    blockStatus,
    statusCode,
  ];
}
