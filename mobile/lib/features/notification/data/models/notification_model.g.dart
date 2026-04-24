// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NotificationModel _$NotificationModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate(
      'NotificationModel',
      json,
      ($checkedConvert) {
        final val = NotificationModel(
          id: $checkedConvert('id', (v) => v as String),
          type: $checkedConvert(
            'type',
            (v) => $enumDecode(_$NotificationTypeEnumMap, v),
          ),
          createdDateRaw: $checkedConvert(
            'notificationCreatedDate',
            (v) => DateTime.parse(v as String),
          ),
          read: $checkedConvert('read', (v) => v as bool),
          content: $checkedConvert('content', (v) => v as String?),
          senderModel: $checkedConvert(
            'sender',
            (v) => v == null
                ? null
                : UserBasicModel.fromJson(v as Map<String, dynamic>),
          ),
          commentModel: $checkedConvert(
            'comment',
            (v) => v == null
                ? null
                : CommentModel.fromJson(v as Map<String, dynamic>),
          ),
          imageId: $checkedConvert('imageId', (v) => v as String?),
          imageUrlRaw: $checkedConvert('image', (v) => v as String?),
        );
        return val;
      },
      fieldKeyMap: const {
        'createdDateRaw': 'notificationCreatedDate',
        'senderModel': 'sender',
        'commentModel': 'comment',
        'imageUrlRaw': 'image',
      },
    );

Map<String, dynamic> _$NotificationModelToJson(NotificationModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': _$NotificationTypeEnumMap[instance.type]!,
      'read': instance.read,
      'content': ?instance.content,
      'imageId': ?instance.imageId,
      'notificationCreatedDate': instance.createdDateRaw.toIso8601String(),
      'sender': ?instance.senderModel?.toJson(),
      'comment': ?instance.commentModel?.toJson(),
      'image': ?instance.imageUrlRaw,
    };

const _$NotificationTypeEnumMap = {
  NotificationType.SUBSCRIPTION: 'SUBSCRIPTION',
  NotificationType.ACCEPTED: 'ACCEPTED',
  NotificationType.COMMENT: 'COMMENT',
  NotificationType.LIKE: 'LIKE',
  NotificationType.REPLY_COMMENT: 'REPLY_COMMENT',
  NotificationType.SALE_IMAGE: 'SALE_IMAGE',
  NotificationType.FOLLOW_REQUEST: 'FOLLOW_REQUEST',
};
