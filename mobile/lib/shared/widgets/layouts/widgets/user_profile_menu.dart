import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/settings/providers/settings_provider.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class UserProfileMenu extends ConsumerWidget {
  const UserProfileMenu({super.key, required this.user});

  final ProfileEntity user;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: Theme(
        data: Theme.of(context).copyWith(
          popupMenuTheme: PopupMenuThemeData(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 4,
          ),
        ),
        child: PopupMenuButton<String>(
          offset: const Offset(0, 56),
          tooltip: 'Show menu',
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            // User Header
            PopupMenuItem<String>(
              enabled: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      UserAvatar(
                        radius: 20,
                        avatarUrl: user.avatar,
                        name: user.firstName ?? user.username,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              user.fullName,
                              style: Theme.of(context).textTheme.titleSmall
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurface,
                                  ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              user.email,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                  ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const PopupMenuDivider(),
            // Balance
            PopupMenuItem<String>(
              value: 'balance',
              child: Row(
                children: <Widget>[
                  Icon(
                    LucideIcons.wallet,
                    size: 20,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 12),
                  const Text('My Balance'),
                ],
              ),
            ),
            // Settings
            PopupMenuItem<String>(
              value: 'settings',
              child: Row(
                children: <Widget>[
                  Icon(
                    LucideIcons.settings,
                    size: 20,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 12),
                  const Text('Settings'),
                ],
              ),
            ),
            const PopupMenuDivider(),
            // Logout
            PopupMenuItem<String>(
              value: 'logout',
              child: Row(
                children: <Widget>[
                  Icon(
                    LucideIcons.logOut,
                    size: 20,
                    color: Theme.of(context).colorScheme.error,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Logout',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
          onSelected: (String value) async {
            if (value == 'settings') {
              await Navigator.of(context).pushNamed(Routes.settings);
            } else if (value == 'balance') {
              await Navigator.of(context).pushNamed(Routes.balance);
            } else if (value == 'logout') {
              await ref.read(settingsControllerProvider.notifier).logout();
              if (context.mounted) {
                await Navigator.of(context).pushNamedAndRemoveUntil(
                  Routes.root,
                  (Route<dynamic> route) => false,
                );
              }
            }
          },
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: UserAvatar(
              radius: 18,
              avatarUrl: user.avatar,
              name: user.firstName ?? user.username,
            ),
          ),
        ),
      ),
    );
  }
}
