import 'package:dabble/features/category/domain/entities/category_entity.dart';
import 'package:dabble/features/image/domain/entities/comment_entity.dart';
import 'package:dabble/features/image/domain/entities/image_entity.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';

import '../../../shared/utils/image_url_helper.dart';

class PostDetailsHeader extends StatelessWidget {
  const PostDetailsHeader({super.key, required this.post});
  final ImageEntity post;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Row(
      children: <Widget>[
        GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, '/u/${post.creator.username}');
          },
          child: Row(
            children: <Widget>[
              UserAvatar(
                avatarUrl: ImageUrlHelper.getImageUrl(post.creator.avatar),
                radius: 24,
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    post.creator.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '@${post.creator.username}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Spacer(),
        // Add follow button or other actions if needed matching web
      ],
    );
  }
}

class PostDescription extends StatelessWidget {
  const PostDescription({
    super.key,
    required this.description,
    required this.categories,
  });

  final String? description;
  final List<dynamic>? categories; // Using dynamic to matching legacy or map

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (description != null && description!.isNotEmpty)
          Text(description!, style: theme.textTheme.bodyLarge),
        if (categories != null && categories!.isNotEmpty) ...<Widget>[
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: categories!.map((dynamic category) {
              // Handle potential CategoryEntity or other types
              final String label = category is CategoryEntity
                  ? '#${category.name}'
                  : '#${category.toString()}';
              return Chip(
                label: Text(label),
                backgroundColor: theme.colorScheme.surfaceContainerHighest,
                side: BorderSide.none,
                labelStyle: theme.textTheme.labelMedium,
              );
            }).toList(),
          ),
        ],
      ],
    );
  }
}

class PostInteractionBar extends StatelessWidget {
  const PostInteractionBar({
    super.key,
    required this.post,
    this.onLike,
    this.onComment,
  });

  final ImageEntity post;
  final VoidCallback? onLike;
  final VoidCallback? onComment;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool isLiked = post.liked;

    return Row(
      children: <Widget>[
        _InteractionButton(
          icon: isLiked ? Icons.favorite : Icons.favorite_border,
          iconColor: isLiked ? Colors.red : null,
          label: post.likeCount.toString(),
          onTap: onLike ?? () {},
        ),
        const SizedBox(width: 16),
        _InteractionButton(
          icon: Icons.chat_bubble_outline,
          label: post.commentCount.toString(),
          onTap: onComment ?? () {},
        ),
        const Spacer(),
        Text(
          '\$${post.price}', // Or Free
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.primary,
          ),
        ),
      ],
    );
  }
}

class _InteractionButton extends StatelessWidget {
  const _InteractionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.iconColor,
  });

  final IconData icon;
  final Color? iconColor;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: <Widget>[
          Icon(icon, color: iconColor),
          const SizedBox(width: 6),
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class CommentsSection extends StatelessWidget {
  const CommentsSection({super.key, required this.comments});
  final List<CommentEntity> comments;

  @override
  Widget build(BuildContext context) {
    if (comments.isEmpty) {
      return const SizedBox.shrink();
    }
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: comments.length,
      itemBuilder: (BuildContext context, int index) {
        final CommentEntity comment = comments[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/u/${comment.sender.username}');
                },
                child: UserAvatar(
                  avatarUrl: ImageUrlHelper.getImageUrl(comment.sender.avatar),
                  radius: 16,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          '/u/${comment.sender.username}',
                        );
                      },
                      child: Text(
                        comment.sender.name,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(comment.content),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
