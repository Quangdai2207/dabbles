import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/profile_providers.dart';

/// Encapsulates all profile-related actions.
///
/// Provides static methods for common profile actions like follow/unfollow,
/// accept/deny requests, block users, etc.
class ProfileActions {
  /// Follows a user.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> followUser(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .followUser(username);
  }

  /// Unfollows a user or cancels a follow request.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> unfollowUser(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .unfollowUser(username);
  }

  /// Accepts a follow request from a user.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> acceptRequest(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .acceptRequest(username);
  }

  /// Denies a follow request from a user.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> denyRequest(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .denyRequest(username);
  }

  /// Blocks a user.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> blockUser(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .blockUser(username);
  }

  /// Removes a user from followers.
  ///
  /// Returns null on success or error message on failure.
  static Future<String?> removeFollower(WidgetRef ref, String username) async {
    return await ref
        .read(userProfileControllerProvider(username).notifier)
        .removeFollower(username);
  }
}
