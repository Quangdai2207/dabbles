import 'package:json_annotation/json_annotation.dart';

import '../../../user/data/models/user_basic_model.dart';
import '../../domain/entities/comment_entity.dart';

part 'comment_model.g.dart';

@JsonSerializable()
class CommentModel extends CommentEntity {
  const CommentModel({
    required super.id,
    required this.senderModel,
    required super.content,
    super.parentId,
    required super.imageId,
    required super.like,
    required super.createdDate,
    super.imageUrl,
    this.replyModels,
  }) : super(sender: senderModel, replies: replyModels);

  factory CommentModel.fromJson(Map<String, dynamic> json) =>
      _$CommentModelFromJson(json);

  @JsonKey(name: 'sender')
  final UserBasicModel senderModel;

  @JsonKey(name: 'replies')
  final List<CommentModel>? replyModels;

  Map<String, dynamic> toJson() => _$CommentModelToJson(this);
}
