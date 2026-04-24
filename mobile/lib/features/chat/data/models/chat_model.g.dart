// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ParticipantModel _$ParticipantModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ParticipantModel', json, ($checkedConvert) {
      final val = ParticipantModel(
        id: $checkedConvert('id', (v) => v as String),
        username: $checkedConvert('username', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String, readValue: _readName),
        avatar: $checkedConvert('avatar', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$ParticipantModelToJson(ParticipantModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'name': instance.name,
      'avatar': ?instance.avatar,
    };

ConversationModel _$ConversationModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate(
      'ConversationModel',
      json,
      ($checkedConvert) {
        final val = ConversationModel(
          id: $checkedConvert('id', (v) => v as String),
          name: $checkedConvert('name', (v) => v as String?),
          type: $checkedConvert('type', (v) => v as String),
          participantModels: $checkedConvert(
            'participants',
            (v) => (v as List<dynamic>)
                .map(
                  (e) => ParticipantModel.fromJson(e as Map<String, dynamic>),
                )
                .toList(),
          ),
          lastMessage: $checkedConvert('lastMessage', (v) => v as String?),
          lastMessageAtUtc: $checkedConvert(
            'lastMessageAt',
            (v) => const UtcDateTimeConverter().fromJson(v as String?),
          ),
          unreadMessageCount: $checkedConvert(
            'unreadMessageCount',
            (v) => (v as num).toInt(),
          ),
          blockStatus: $checkedConvert(
            'blockStatus',
            (v) => v as String? ?? 'NONE',
          ),
          avatar: $checkedConvert('avatar', (v) => v as String?),
          createdAtUtc: $checkedConvert(
            'createdAt',
            (v) => const UtcDateTimeConverter().fromJson(v as String?),
          ),
        );
        return val;
      },
      fieldKeyMap: const {
        'participantModels': 'participants',
        'lastMessageAtUtc': 'lastMessageAt',
        'createdAtUtc': 'createdAt',
      },
    );

Map<String, dynamic> _$ConversationModelToJson(
  ConversationModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': ?instance.name,
  'lastMessage': ?instance.lastMessage,
  'unreadMessageCount': instance.unreadMessageCount,
  'blockStatus': instance.blockStatus,
  'avatar': ?instance.avatar,
  'type': instance.type,
  'participants': instance.participantModels.map((e) => e.toJson()).toList(),
  'lastMessageAt': ?const UtcDateTimeConverter().toJson(
    instance.lastMessageAtUtc,
  ),
  'createdAt': ?const UtcDateTimeConverter().toJson(instance.createdAtUtc),
};

ChatMessageModel _$ChatMessageModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ChatMessageModel', json, ($checkedConvert) {
      final val = ChatMessageModel(
        id: $checkedConvert('id', (v) => v as String),
        conversationId: $checkedConvert('conversationId', (v) => v as String),
        participantModel: $checkedConvert(
          'sender',
          (v) => ParticipantModel.fromJson(v as Map<String, dynamic>),
        ),
        content: $checkedConvert('content', (v) => v as String),
        createdDate: $checkedConvert(
          'createdDate',
          (v) => DateTime.parse(v as String),
        ),
        messageType: $checkedConvert(
          'messageType',
          (v) => v as String? ?? 'TEXT',
        ),
      );
      return val;
    }, fieldKeyMap: const {'participantModel': 'sender'});

Map<String, dynamic> _$ChatMessageModelToJson(ChatMessageModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'conversationId': instance.conversationId,
      'content': instance.content,
      'sender': instance.participantModel.toJson(),
      'createdDate': instance.createdDate.toIso8601String(),
      'messageType': instance.messageType,
    };
