import 'package:equatable/equatable.dart';

import '../../../user/domain/entities/user_basic_entity.dart';

class CommentEntity extends Equatable {
  const CommentEntity({
    required this.id,
    required this.sender,
    required this.content,
    required this.parentId,
    required this.imageId,
    required this.like,
    required this.createdDate,
    this.imageUrl,
    this.replies,
  });

  final String id;
  final UserBasicEntity sender;
  final String content;
  final String? parentId;
  final String imageId;
  final int like;
  final DateTime createdDate;
  final String? imageUrl;
  final List<CommentEntity>? replies;

  @override
  List<Object?> get props => <Object?>[
    id,
    sender,
    content,
    parentId,
    imageId,
    like,
    createdDate,
    imageUrl,
    replies,
  ];
}
