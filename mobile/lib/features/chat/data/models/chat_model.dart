import 'package:json_annotation/json_annotation.dart';

import '../../../../shared/utils/datetime_converter.dart';
import '../../domain/entities/chat_entity.dart';

part 'chat_model.g.dart';

@JsonSerializable()
class ParticipantModel extends ParticipantEntity {
  const ParticipantModel({
    required super.id,
    required super.username,
    // ignore: invalid_annotation_target
    @JsonKey(readValue: _readName) required super.name,
    super.avatar,
  });

  factory ParticipantModel.fromJson(Map<String, dynamic> json) =>
      _$ParticipantModelFromJson(json);

  Map<String, dynamic> toJson() => _$ParticipantModelToJson(this);
}

@JsonSerializable()
class ConversationModel extends ConversationEntity {
  factory ConversationModel.fromJson(Map<String, dynamic> json) {
    // Handle both 'id' and 'conversationId'
    if (json['id'] == null && json['conversationId'] != null) {
      json['id'] = json['conversationId'];
    }
    // Handle partial response from findConversation
    if (json['participants'] == null) {
      json['participants'] = <dynamic>[];
    }
    if (json['unreadMessageCount'] == null) {
      json['unreadMessageCount'] = 0;
    }
    if (json['type'] == null) {
      json['type'] = 'PRIVATE';
    }
    return _$ConversationModelFromJson(json);
  }
  const ConversationModel({
    required super.id,
    super.name,
    required this.type,
    required this.participantModels,
    super.lastMessage,
    this.lastMessageAtUtc,
    required super.unreadMessageCount,
    super.blockStatus,
    super.avatar,
    this.createdAtUtc,
  }) : super(
         isGroup: type == 'GROUP',
         participants: participantModels,
         lastMessageAt: lastMessageAtUtc,
         createdAt: createdAtUtc,
       );

  final String type;

  @JsonKey(name: 'participants')
  final List<ParticipantModel> participantModels;

  @UtcDateTimeConverter()
  @JsonKey(name: 'lastMessageAt')
  final DateTime? lastMessageAtUtc;

  @UtcDateTimeConverter()
  @JsonKey(name: 'createdAt')
  final DateTime? createdAtUtc;

  Map<String, dynamic> toJson() => _$ConversationModelToJson(this);
}

@JsonSerializable()
class ChatMessageModel extends ChatMessageEntity {
  factory ChatMessageModel.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageModelFromJson(json);
  const ChatMessageModel({
    required super.id,
    required super.conversationId,
    required this.participantModel,
    required super.content,
    required this.createdDate,
    this.messageType = 'TEXT',
  }) : super(
         sender: participantModel,
         createdAt: createdDate,
         type: messageType,
       );

  @JsonKey(name: 'sender')
  final ParticipantModel participantModel;

  final DateTime createdDate;

  final String messageType;

  Map<String, dynamic> toJson() => _$ChatMessageModelToJson(this);
}

Object? _readName(Map<dynamic, dynamic> map, String key) {
  return map['fullName'] ?? map['name'];
}
