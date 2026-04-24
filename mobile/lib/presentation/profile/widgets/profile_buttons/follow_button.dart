import 'package:dabble/presentation/profile/utils/profile_actions.dart';
import 'package:dabble/shared/utils/action_toast_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Follow/Unfollow button for user profiles.
///
/// Displays different states based on follow status:
/// - Not following: Primary "Follow" button
/// - Following: Outlined "Following" button
/// - Requested: Outlined "Requested" button
class FollowButton extends ConsumerWidget {
  const FollowButton({
    super.key,
    required this.username,
    required this.isFollowing,
    required this.isRequested,
  });

  final String username;
  final bool isFollowing;
  final bool isRequested;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ThemeData theme = Theme.of(context);

    if (isFollowing || isRequested) {
      return OutlinedButton(
        onPressed: () => _handleUnfollow(context, ref),
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: theme.colorScheme.outline),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: Text(
          isFollowing ? 'Following' : 'Requested',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
      );
    }

    return ElevatedButton(
      onPressed: () => _handleFollow(context, ref),
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: const Text(
        'Follow',
        style: TextStyle(fontWeight: FontWeight.w600),
      ),
    );
  }

  Future<void> _handleFollow(BuildContext context, WidgetRef ref) async {
    await ActionToastHandler.execute(
      context,
      () => ProfileActions.followUser(ref, username),
      'Follow request sent',
    );
  }

  Future<void> _handleUnfollow(BuildContext context, WidgetRef ref) async {
    final String message = isFollowing
        ? 'Unfollowed $username'
        : 'Canceled follow request';

    await ActionToastHandler.execute(
      context,
      () => ProfileActions.unfollowUser(ref, username),
      message,
    );
  }
}
