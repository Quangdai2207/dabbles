import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/features/user/domain/entities/user_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import 'profile_buttons/edit_profile_button.dart';
import 'profile_buttons/follow_button.dart';
import 'profile_buttons/message_button.dart';
import 'profile_buttons/profile_menu_button.dart';
import 'profile_buttons/request_action_buttons.dart';

/// Action buttons for user profiles.
///
/// Displays different button combinations based on the relationship
/// between the authenticated user and the profile being viewed:
/// - Own profile: Edit Profile button
/// - Pending request: Accept/Reject buttons
/// - Other user: Follow/Message buttons + Share/Menu
class ProfileActionButtons extends ConsumerWidget {
  const ProfileActionButtons({super.key, required this.profile});

  final UserEntity profile;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<ProfileEntity?> authProfileAsync = ref.watch(
      currentUserProvider,
    );
    final ThemeData theme = Theme.of(context);

    return authProfileAsync.when(
      data: (ProfileEntity? authProfile) {
        if (authProfile == null) return const SizedBox.shrink();

        final bool isOwnProfile = authProfile.username == profile.username;
        final bool isFollowing = profile.isFollowing;
        final bool isRequested = profile.isRequested;
        final bool isSenderPending = profile.isFollower && !isFollowing;

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: <Widget>[
              // Own profile: Edit button
              if (isOwnProfile)
                const Expanded(child: EditProfileButton())
              // Pending request: Accept/Reject buttons
              else if (isSenderPending)
                Expanded(
                  child: RequestActionButtons(username: profile.username),
                )
              // Other user: Follow + Message buttons
              else ...<Widget>[
                Expanded(
                  child: FollowButton(
                    username: profile.username,
                    isFollowing: isFollowing,
                    isRequested: isRequested,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(child: MessageButton(username: profile.username)),
              ],

              // Other user: Share + Menu buttons
              if (!isOwnProfile) ...<Widget>[
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () {
                    // TODO: Share profile
                  },
                  icon: const Icon(LucideIcons.share2, size: 20),
                  style: IconButton.styleFrom(
                    side: BorderSide(color: theme.colorScheme.outline),
                  ),
                ),
                const SizedBox(width: 8),
                ProfileMenuButton(
                  username: profile.username,
                  isFollowing: isFollowing,
                ),
              ],
            ],
          ),
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (Object error, StackTrace stack) => const SizedBox.shrink(),
    );
  }
}
