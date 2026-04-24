// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comment_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommentModel _$CommentModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate(
      'CommentModel',
      json,
      ($checkedConvert) {
        final val = CommentModel(
          id: $checkedConvert('id', (v) => v as String),
          senderModel: $checkedConvert(
            'sender',
            (v) => UserBasicModel.fromJson(v as Map<String, dynamic>),
          ),
          content: $checkedConvert('content', (v) => v as String),
          parentId: $checkedConvert('parentId', (v) => v as String?),
          imageId: $checkedConvert('imageId', (v) => v as String),
          like: $checkedConvert('like', (v) => (v as num).toInt()),
          createdDate: $checkedConvert(
            'createdDate',
            (v) => DateTime.parse(v as String),
          ),
          imageUrl: $checkedConvert('imageUrl', (v) => v as String?),
          replyModels: $checkedConvert(
            'replies',
            (v) => (v as List<dynamic>?)
                ?.map((e) => CommentModel.fromJson(e as Map<String, dynamic>))
                .toList(),
          ),
        );
        return val;
      },
      fieldKeyMap: const {'senderModel': 'sender', 'replyModels': 'replies'},
    );

Map<String, dynamic> _$CommentModelToJson(CommentModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'parentId': ?instance.parentId,
      'imageId': instance.imageId,
      'like': instance.like,
      'createdDate': instance.createdDate.toIso8601String(),
      'imageUrl': ?instance.imageUrl,
      'sender': instance.senderModel.toJson(),
      'replies': ?instance.replyModels?.map((e) => e.toJson()).toList(),
    };
