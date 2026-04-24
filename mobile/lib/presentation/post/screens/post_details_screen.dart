import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/image/domain/entities/comment_entity.dart';
import 'package:dabble/features/image/domain/entities/image_entity.dart';
import 'package:dabble/features/image/injection/image_injection.dart';
import 'package:dabble/shared/utils/image_url_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/ui/common_app_bar.dart';
import '../../../shared/widgets/ui/full_screen_image_viewer.dart';
import '../controllers/post_details_controller.dart';
import '../providers/post_details_providers.dart';
import '../states/post_details_state.dart';
import '../widgets/comment_input.dart';
import '../widgets/post_widgets.dart';

class PostDetailsScreen extends ConsumerWidget {
  const PostDetailsScreen({super.key, required this.imageId});

  final String imageId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final PostDetailsState state = ref.watch(
      postDetailsControllerProvider(imageId),
    );
    final PostDetailsController controller = ref.read(
      postDetailsControllerProvider(imageId).notifier,
    );
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      appBar: const CommonAppBar(title: 'Post Details'),
      body: state.post.when(
        data: (ImageEntity? post) {
          if (post == null) {
            return const Center(child: Text('Post not found'));
          }
          return Column(
            children: <Widget>[
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () async {
                    await Future.wait(<Future<void>>[
                      controller.loadPost(),
                      controller.loadComments(),
                    ]);
                  },
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        // Hero Image
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute<void>(
                                builder: (BuildContext context) =>
                                    FullScreenImageViewer(
                                      imageUrl: ImageUrlHelper.getImageUrl(
                                        post.imageUrls.original,
                                      ),
                                      heroTag: 'post_image_${post.id}',
                                    ),
                              ),
                            );
                          },
                          child: Hero(
                            tag: 'post_image_${post.id}',
                            child: Image.network(
                              ImageUrlHelper.getImageUrl(
                                post.imageUrls.original,
                              ),
                              fit: BoxFit.cover,
                              loadingBuilder:
                                  (
                                    BuildContext context,
                                    Widget child,
                                    ImageChunkEvent? loadingProgress,
                                  ) {
                                    if (loadingProgress == null) return child;
                                    return AspectRatio(
                                      aspectRatio:
                                          (post.width != null &&
                                              post.height != null)
                                          ? post.width! / post.height!
                                          : 1.0,
                                      child: Center(
                                        child: CircularProgressIndicator(
                                          value:
                                              loadingProgress
                                                      .expectedTotalBytes !=
                                                  null
                                              ? loadingProgress
                                                        .cumulativeBytesLoaded /
                                                    loadingProgress
                                                        .expectedTotalBytes!
                                              : null,
                                        ),
                                      ),
                                    );
                                  },
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              PostDetailsHeader(post: post),
                              const SizedBox(height: 16),
                              PostDescription(
                                description: post.description,
                                categories: post.categories,
                              ),
                              const SizedBox(height: 16),
                              const Divider(),
                              const SizedBox(height: 12),
                              PostInteractionBar(
                                post: post,
                                onLike: () async {
                                  final ApiResponseStatus result = await ref
                                      .read(likeImageUseCaseProvider)
                                      .call(post.id);
                                  if (result.isSuccess) {
                                    // Refresh the post details silently to show updated like count/status
                                    // This preserves scroll position as the loading state is skipped
                                    await controller.loadPost(silent: true);
                                  }
                                },
                              ),
                              const SizedBox(height: 16),
                              // Comments Section
                              Text(
                                'Comments (${post.commentCount})',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 12),
                              // CommentInput moved to bottom fixed
                              const SizedBox(height: 16),
                              state.comments.when(
                                data: (List<CommentEntity> comments) {
                                  if (comments.isEmpty) {
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 20,
                                      ),
                                      child: Center(
                                        child: Text(
                                          'No comments yet',
                                          style: theme.textTheme.bodyMedium
                                              ?.copyWith(
                                                color:
                                                    theme.colorScheme.outline,
                                              ),
                                        ),
                                      ),
                                    );
                                  }
                                  return CommentsSection(comments: comments);
                                },
                                loading: () => const Center(
                                  child: Padding(
                                    padding: EdgeInsets.all(20.0),
                                    child: CircularProgressIndicator(),
                                  ),
                                ),
                                error: (Object err, StackTrace stack) =>
                                    Text('Error loading comments: $err'),
                              ),
                            ],
                          ),
                        ),
                        // Add bottom padding for better scroll experience
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),
              CommentInput(imageId: post.id),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (Object err, StackTrace stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Error loading post: $err'),
          ),
        ),
      ),
    );
  }
}
