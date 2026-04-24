import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/api_response.dart';
import '../../../../features/image/domain/entities/comment_entity.dart';
import '../../../../features/image/domain/entities/image_entity.dart';
import '../../../../features/image/domain/usecases/image_usecases.dart';
import '../../../../features/image/injection/image_injection.dart';
import '../states/post_details_state.dart';

class PostDetailsController extends StateNotifier<PostDetailsState> {
  PostDetailsController(this._ref, this._imageId)
    : super(const PostDetailsState()) {
    _init();
  }

  final Ref _ref;
  final String _imageId;

  Future<void> _init() async {
    await Future.wait<void>(<Future<void>>[loadPost(), loadComments()]);
  }

  Future<void> loadPost({bool silent = false}) async {
    if (!silent) {
      state = state.copyWith(post: const AsyncValue<ImageEntity?>.loading());
    }
    try {
      final GetImageByIdUseCase useCase = _ref.read(
        getImageByIdUseCaseProvider,
      );
      final ApiResponseObject<ImageEntity> response = await useCase(_imageId);

      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          post: AsyncValue<ImageEntity?>.data(response.data),
        );
      } else {
        state = state.copyWith(
          post: AsyncValue<ImageEntity?>.error(
            response.errorMessage.isNotEmpty
                ? response.errorMessage
                : 'Failed to load post',
            StackTrace.current,
          ),
        );
      }
    } catch (e, st) {
      state = state.copyWith(post: AsyncValue<ImageEntity?>.error(e, st));
    }
  }

  Future<void> loadComments({bool silent = false}) async {
    if (!silent) {
      state = state.copyWith(
        comments: const AsyncValue<List<CommentEntity>>.loading(),
      );
    }
    try {
      final GetCommentsUseCase useCase = _ref.read(getCommentsUseCaseProvider);
      final ApiResponseObject<List<CommentEntity>> response = await useCase(
        _imageId,
      );

      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          comments: AsyncValue<List<CommentEntity>>.data(response.data!),
        );
      } else {
        state = state.copyWith(
          comments: AsyncValue<List<CommentEntity>>.data(<CommentEntity>[]),
        );
      }
    } catch (e, st) {
      state = state.copyWith(
        comments: AsyncValue<List<CommentEntity>>.error(e, st),
      );
    }
  }

  void setCommentInput(String value) {
    state = state.copyWith(commentInput: value);
  }

  Future<bool> sendComment() async {
    if (state.commentInput.trim().isEmpty) return false;

    state = state.copyWith(isPostingComment: true);
    try {
      final CommentImageUseCase useCase = _ref.read(
        commentImageUseCaseProvider,
      );
      final ApiResponseStatus response = await useCase(
        imageId: _imageId,
        content: state.commentInput.trim(),
      );

      if (response.isSuccess) {
        state = state.copyWith(commentInput: '', isPostingComment: false);
        await loadComments(silent: true); // Refresh comments silently
        // Also refresh post to update comment count
        await loadPost(silent: true);
        return true;
      } else {
        state = state.copyWith(isPostingComment: false);
        return false;
      }
    } catch (e) {
      state = state.copyWith(isPostingComment: false);
      return false;
    }
  }
}
