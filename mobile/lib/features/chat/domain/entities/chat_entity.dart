import 'package:equatable/equatable.dart';

class ParticipantEntity extends Equatable {
  const ParticipantEntity({
    required this.id,
    required this.username,
    required this.name,
    this.avatar,
  });

  final String id;
  final String username;
  final String name;
  final String? avatar;

  @override
  List<Object?> get props => <Object?>[id, username, name, avatar];
}

class ConversationEntity extends Equatable {
  const ConversationEntity({
    required this.id,
    required this.name,
    required this.isGroup,
    required this.participants,
    this.lastMessage,
    this.lastMessageAt,
    required this.unreadMessageCount,
    this.blockStatus = 'NONE',
    this.avatar,
    this.createdAt,
  });

  final String id;
  final String? name;
  final bool isGroup;
  final List<ParticipantEntity> participants;
  final String? lastMessage;
  final DateTime? lastMessageAt;
  final int unreadMessageCount;
  final String blockStatus;
  final String? avatar;
  final DateTime? createdAt;

  @override
  List<Object?> get props => <Object?>[
    id,
    name,
    isGroup,
    participants,
    lastMessage,
    lastMessageAt,
    unreadMessageCount,
    blockStatus,
    avatar,
    createdAt,
  ];
}

class ChatMessageEntity extends Equatable {
  const ChatMessageEntity({
    required this.id,
    required this.conversationId,
    required this.sender,
    required this.content,
    required this.createdAt,
    this.type = 'TEXT',
  });

  final String id;
  final String conversationId;
  final ParticipantEntity sender;
  final String content;
  final DateTime createdAt;
  final String type;

  @override
  List<Object?> get props => <Object?>[
    id,
    conversationId,
    sender,
    content,
    createdAt,
    type,
  ];
}
