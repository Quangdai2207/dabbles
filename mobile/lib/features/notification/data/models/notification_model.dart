import 'package:json_annotation/json_annotation.dart';

import '../../../image/data/models/comment_model.dart';
import '../../../user/data/models/user_basic_model.dart';
import '../../domain/entities/notification_entity.dart';

part 'notification_model.g.dart';

@JsonSerializable()
class NotificationModel extends NotificationEntity {
  const NotificationModel({
    required super.id,
    required super.type,
    required this.createdDateRaw,
    required super.read,
    super.content,
    this.senderModel,
    this.commentModel,
    super.imageId,
    this.imageUrlRaw,
  }) : super(
         notificationCreatedDate: createdDateRaw,
         sender: senderModel,
         comment: commentModel,
         imageUrl: imageUrlRaw,
       );

  factory NotificationModel.fromJson(Map<String, dynamic> json) =>
      _$NotificationModelFromJson(json);

  @JsonKey(name: 'notificationCreatedDate')
  final DateTime createdDateRaw;

  @JsonKey(name: 'sender')
  final UserBasicModel? senderModel;

  @JsonKey(name: 'comment')
  final CommentModel? commentModel;

  @JsonKey(name: 'image')
  final String? imageUrlRaw;

  Map<String, dynamic> toJson() => _$NotificationModelToJson(this);
}
