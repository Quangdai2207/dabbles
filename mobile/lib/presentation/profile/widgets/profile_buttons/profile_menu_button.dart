import 'package:dabble/presentation/profile/utils/profile_actions.dart';
import 'package:dabble/shared/utils/action_toast_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

/// Profile menu button with actions like block and remove follower.
///
/// Displays a popup menu with:
/// - Remove follower (only if user is following)
/// - Block user
class ProfileMenuButton extends ConsumerWidget {
  const ProfileMenuButton({
    super.key,
    required this.username,
    required this.isFollowing,
  });

  final String username;
  final bool isFollowing;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ThemeData theme = Theme.of(context);

    return PopupMenuButton<String>(
      icon: const Icon(LucideIcons.ellipsis, size: 20),
      style: IconButton.styleFrom(
        side: BorderSide(color: theme.colorScheme.outline),
      ),
      onSelected: (String value) {
        if (value == 'block') {
          _handleBlock(context, ref);
        } else if (value == 'remove') {
          _handleRemoveFollower(context, ref);
        }
      },
      itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
        if (isFollowing)
          PopupMenuItem<String>(
            value: 'remove',
            child: Row(
              children: <Widget>[
                Icon(
                  LucideIcons.userMinus,
                  size: 16,
                  color: theme.colorScheme.error,
                ),
                const SizedBox(width: 8),
                Text(
                  'Remove follower',
                  style: TextStyle(color: theme.colorScheme.error),
                ),
              ],
            ),
          ),
        PopupMenuItem<String>(
          value: 'block',
          child: Row(
            children: <Widget>[
              Icon(LucideIcons.ban, size: 16, color: theme.colorScheme.error),
              const SizedBox(width: 8),
              Text('Block', style: TextStyle(color: theme.colorScheme.error)),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _handleBlock(BuildContext context, WidgetRef ref) async {
    await ActionToastHandler.execute(
      context,
      () => ProfileActions.blockUser(ref, username),
      'Blocked $username',
      onSuccess: () async {
        if (context.mounted) {
          await Navigator.of(
            context,
          ).pushNamedAndRemoveUntil('/home', (Route<dynamic> route) => false);
        }
      },
    );
  }

  Future<void> _handleRemoveFollower(
    BuildContext context,
    WidgetRef ref,
  ) async {
    await ActionToastHandler.execute(
      context,
      () => ProfileActions.removeFollower(ref, username),
      'Removed $username from followers',
    );
  }
}
