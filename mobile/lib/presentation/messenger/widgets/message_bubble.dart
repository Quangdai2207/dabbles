import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../features/chat/domain/entities/chat_entity.dart';
import '../../../shared/constants/app_spacing.dart';
import '../../../shared/widgets/user_avatar.dart';

/// A widget that displays a single message bubble in the chat.
///
/// Handles different layouts for sent (current user) and received messages,
/// including avatar display, bubble styling, and optional timestamp.
class MessageBubble extends StatelessWidget {
  const MessageBubble({
    super.key,
    required this.message,
    required this.isCurrentUser,
    required this.showAvatar,
    required this.showTimestamp,
    required this.onTap,
  });

  final ChatMessageEntity message;
  final bool isCurrentUser;
  final bool showAvatar;
  final bool showTimestamp;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: showAvatar || isCurrentUser ? AppSpacing.sm : 2,
      ),
      child: Row(
        mainAxisAlignment: isCurrentUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          if (!isCurrentUser) ...<Widget>[
            if (showAvatar)
              UserAvatar(
                avatarUrl: message.sender.avatar,
                name: message.sender.name,
                radius: 14,
                fontSize: 10,
              )
            else
              const SizedBox(width: 28), // radius * 2
            const SizedBox(width: AppSpacing.sm),
          ],
          Flexible(
            child: GestureDetector(
              onTap: onTap,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: isCurrentUser
                      ? Theme.of(context).primaryColor
                      : Colors.grey.shade200,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(AppSpacing.md),
                    topRight: const Radius.circular(AppSpacing.md),
                    bottomLeft: Radius.circular(
                      isCurrentUser ? AppSpacing.md : AppSpacing.xs,
                    ),
                    bottomRight: Radius.circular(
                      isCurrentUser ? AppSpacing.xs : AppSpacing.md,
                    ),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: isCurrentUser
                      ? CrossAxisAlignment.end
                      : CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      message.content,
                      style: TextStyle(
                        color: isCurrentUser ? Colors.white : Colors.black87,
                        fontSize: 16,
                      ),
                    ),
                    if (showTimestamp) ...<Widget>[
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        DateFormat.jm().format(message.createdAt),
                        style: TextStyle(
                          color: isCurrentUser
                              ? Colors.white70
                              : Colors.black54,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
