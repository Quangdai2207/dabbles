import 'package:dabble/shared/utils/app_log.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/config/env.dart';
import '../../../features/notification/domain/entities/notification_entity.dart';
import '../../../presentation/notification/providers/notification_provider.dart';
import '../../utils/date_format_utils.dart';
import '../user_avatar.dart';

class NotificationTile extends ConsumerWidget {
  const NotificationTile({super.key, required this.notification});

  final NotificationEntity notification;

  String get _postImageUrl {
    final String? image = notification.relevantImageUrl;
    if (image == null || image.isEmpty) return '';
    if (image.startsWith('http') || image.startsWith('https')) return image;
    AppLog.debug('Image URL: ${Env.imageBaseUrl}/$image');
    return '${Env.imageBaseUrl}$image';
  }

  void _onTap(BuildContext context, WidgetRef ref) {
    if (!notification.read) {
      ref.read(notificationListProvider.notifier).markAsRead(notification.id);
    }
    _navigateToTarget(context);
  }

  void _navigateToTarget(BuildContext context) {
    // Basic navigation logic based on type
    if (notification.type == NotificationType.FOLLOW_REQUEST ||
        notification.type == NotificationType.ACCEPTED ||
        notification.type == NotificationType.SUBSCRIPTION) {
      if (notification.triggerUser != null) {
        // Navigate to profile
        // Navigator.pushNamed(context, Routes.profile, arguments: notification.triggerUser!.id);
        // Assuming route exists or simplified for now
      }
    } else if (notification.imageId != null) {
      // Navigate to post
      // Navigator.pushNamed(context, Routes.postDetails, arguments: notification.imageId);
    }
  }

  Widget _buildContent(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;
    final String senderName = notification.triggerUser?.username ?? 'System';
    final TextStyle boldStyle = textTheme.bodyMedium!.copyWith(
      fontWeight: FontWeight.bold,
    );
    final TextStyle normalStyle = textTheme.bodyMedium!;

    final List<InlineSpan> spans = <InlineSpan>[
      TextSpan(text: senderName, style: boldStyle),
    ];

    switch (notification.type) {
      case NotificationType.LIKE:
        spans.add(const TextSpan(text: ' liked your post.'));
        break;
      case NotificationType.COMMENT:
        spans.add(const TextSpan(text: ' commented: "'));
        if (notification.comment != null) {
          spans.add(
            TextSpan(text: notification.comment!.content, style: normalStyle),
          ); // Assuming CommentEntity has content
        } else {
          spans.add(const TextSpan(text: '...'));
        }
        spans.add(const TextSpan(text: '"'));
        break;
      case NotificationType.FOLLOW_REQUEST:
        spans.add(const TextSpan(text: ' started following you.'));
        break;
      case NotificationType.ACCEPTED:
        spans.add(const TextSpan(text: ' accepted your follow request.'));
        break;
      case NotificationType.SUBSCRIPTION:
        spans.add(const TextSpan(text: ' subscribed to your plan.'));
        break;
      case NotificationType.SALE_IMAGE:
        spans.add(const TextSpan(text: ' purchased your image.'));
        break;
      case NotificationType.REPLY_COMMENT:
        spans.add(const TextSpan(text: ' replied to your comment.'));
        break;
      // No default needed as all cases are covered
    }

    return RichText(
      text: TextSpan(
        style: normalStyle.copyWith(
          color: Theme.of(context).colorScheme.onSurface,
        ),
        children: spans,
      ),
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final bool isUnread = !notification.read;

    return InkWell(
      onTap: () => _onTap(context, ref),
      child: Container(
        color: isUnread
            ? colorScheme.primary.withValues(alpha: 0.1)
            : Colors.transparent,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Avatar
            GestureDetector(
              onTap: () {
                if (notification.triggerUser?.username != null) {
                  Navigator.pushNamed(
                    context,
                    '/u/${notification.triggerUser!.username}',
                  );
                }
              },
              child: UserAvatar(
                avatarUrl: notification.triggerUser?.avatar,
                name: notification.triggerUser?.username,
                radius: 20,
              ),
            ),
            const SizedBox(width: 12),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  _buildContent(context),
                  const SizedBox(height: 4),
                  Text(
                    DateFormatUtils.getRelativeTime(
                      notification.notificationCreatedDate,
                    ),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            // Trailing Section
            Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                // Post Image (Action)
                if (_postImageUrl.isNotEmpty) ...<Widget>[
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {
                      final String? targetId = notification.relevantImageId;
                      if (targetId != null && targetId.isNotEmpty) {
                        Navigator.pushNamed(context, '/p/$targetId');
                      }
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: colorScheme.outlineVariant,
                          width: 0.5,
                        ),
                        image: DecorationImage(
                          image: NetworkImage(_postImageUrl),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ],

                // Unread Indicator (Purple Dot)
                if (isUnread) ...<Widget>[
                  const SizedBox(width: 8),
                  Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Colors.purple, // Match client's purple-600
                      shape: BoxShape.circle,
                    ),
                  ),
                ],

                // Menu (3 dots)
                const SizedBox(width: 4),
                MenuAnchor(
                  builder:
                      (
                        BuildContext context,
                        MenuController controller,
                        Widget? child,
                      ) {
                        return IconButton(
                          onPressed: () {
                            if (controller.isOpen) {
                              controller.close();
                            } else {
                              controller.open();
                            }
                          },
                          icon: Icon(
                            Icons.more_horiz,
                            size: 16,
                            color: colorScheme.onSurfaceVariant,
                          ),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          visualDensity: VisualDensity.compact,
                        );
                      },
                  menuChildren: <Widget>[
                    if (isUnread)
                      MenuItemButton(
                        onPressed: () {
                          ref
                              .read(notificationListProvider.notifier)
                              .markAsRead(notification.id);
                        },
                        child: const Row(
                          children: <Widget>[
                            Icon(LucideIcons.check, size: 16),
                            SizedBox(width: 8),
                            Text('Mark as read'),
                          ],
                        ),
                      ),
                    MenuItemButton(
                      onPressed: () {
                        ref
                            .read(notificationListProvider.notifier)
                            .deleteNotification(notification.id);
                      },
                      child: const Row(
                        children: <Widget>[
                          Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Remove', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
