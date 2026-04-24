import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/image/domain/entities/comment_entity.dart';
import '../../../../features/image/domain/entities/image_entity.dart';

class PostDetailsState extends Equatable {
  const PostDetailsState({
    this.post = const AsyncValue<ImageEntity?>.loading(),
    this.comments = const AsyncValue<List<CommentEntity>>.loading(),
    this.commentInput = '',
    this.isPostingComment = false,
  });

  final AsyncValue<ImageEntity?> post;
  final AsyncValue<List<CommentEntity>> comments;
  final String commentInput;
  final bool isPostingComment;

  PostDetailsState copyWith({
    AsyncValue<ImageEntity?>? post,
    AsyncValue<List<CommentEntity>>? comments,
    String? commentInput,
    bool? isPostingComment,
  }) {
    return PostDetailsState(
      post: post ?? this.post,
      comments: comments ?? this.comments,
      commentInput: commentInput ?? this.commentInput,
      isPostingComment: isPostingComment ?? this.isPostingComment,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    post,
    comments,
    commentInput,
    isPostingComment,
  ];
}
