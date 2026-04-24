import 'package:equatable/equatable.dart';

import '../../../image/domain/entities/comment_entity.dart';
import '../../../user/domain/entities/user_basic_entity.dart';

// ignore_for_file: constant_identifier_names
enum NotificationType {
  SUBSCRIPTION,
  ACCEPTED,
  COMMENT,
  LIKE,
  REPLY_COMMENT,
  SALE_IMAGE,
  FOLLOW_REQUEST,
}

class NotificationEntity extends Equatable {
  const NotificationEntity({
    required this.id,
    required this.type,
    required this.notificationCreatedDate,
    required this.read,
    this.content,
    this.sender,
    this.comment,
    this.imageId,
    this.imageUrl,
  });

  final String id;
  final NotificationType type;
  final DateTime notificationCreatedDate;
  final bool read;
  final String? content;
  final UserBasicEntity? sender;
  final CommentEntity? comment;
  final String? imageId;
  final String? imageUrl; // Mapped from 'image' field

  @override
  List<Object?> get props => <Object?>[
    id,
    type,
    notificationCreatedDate,
    read,
    content,
    sender,
    comment,
    imageId,
    imageUrl,
  ];

  UserBasicEntity? get triggerUser => sender ?? comment?.sender;

  String? get relevantImageUrl => imageUrl ?? comment?.imageUrl;

  String? get relevantImageId => imageId ?? comment?.imageId;
}
