import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/utils/image_url_helper.dart';
import '../controllers/post_details_controller.dart';
import '../providers/post_details_providers.dart';
import '../states/post_details_state.dart';

class CommentInput extends ConsumerStatefulWidget {
  const CommentInput({super.key, required this.imageId});

  final String imageId;

  @override
  ConsumerState<CommentInput> createState() => _CommentInputState();
}

class _CommentInputState extends ConsumerState<CommentInput> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AsyncValue<ProfileEntity?> userState = ref.watch(currentUserProvider);
    final PostDetailsState state = ref.watch(
      postDetailsControllerProvider(widget.imageId),
    );
    final PostDetailsController controller = ref.read(
      postDetailsControllerProvider(widget.imageId).notifier,
    );
    final ThemeData theme = Theme.of(context);

    // Sync controller with state
    if (_controller.text != state.commentInput) {
      _controller.text = state.commentInput;
      _controller.selection = TextSelection.fromPosition(
        TextPosition(offset: state.commentInput.length),
      );
    }

    final ProfileEntity? user = userState.value;

    if (user == null) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: OutlinedButton(
          onPressed: () {
            Navigator.of(context).pushNamed('/login');
          },
          child: const Text('Log in to join the conversation'),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          top: BorderSide(color: theme.dividerColor.withValues(alpha: 0.1)),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0, right: 8.0),
            child: UserAvatar(
              avatarUrl: ImageUrlHelper.getImageUrl(user.avatar),
              radius: 16,
            ),
          ),
          Expanded(
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Add a comment...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerHighest,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
              minLines: 1,
              maxLines: 4,
              onChanged: controller.setCommentInput,
              onSubmitted: (_) async {
                final bool success = await controller.sendComment();
                if (!success && context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Failed to post comment')),
                  );
                }
              },
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: state.isPostingComment
                ? null
                : () async {
                    final bool success = await controller.sendComment();
                    if (!success && context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to post comment')),
                      );
                    }
                  },
            icon: state.isPostingComment
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Icon(
                    Icons.send,
                    color: state.commentInput.isNotEmpty
                        ? theme.colorScheme.primary
                        : theme.disabledColor,
                  ),
          ),
        ],
      ),
    );
  }
}
