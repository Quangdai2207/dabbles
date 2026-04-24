import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../shared/widgets/ui/common_app_bar.dart';
import '../providers/settings_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<void> state = ref.watch(settingsControllerProvider);
    final AsyncValue<ProfileEntity?> currentUserState = ref.watch(
      currentUserProvider,
    );
    final ProfileEntity? user = currentUserState.value;

    ref.listen(settingsControllerProvider, (
      AsyncValue<void>? previous,
      AsyncValue<void> next,
    ) {
      if (next.hasError) {
        ToastUtils.showError(
          context,
          title: 'Settings Update Failed',
          description: next.error.toString(),
        );
      } else if (next is AsyncData &&
          !next.isLoading &&
          previous is AsyncLoading) {
        // We only show success toast if we are NOT logging out (user is still present)
        // or simply show it.
        // Since logout navigates away, a toast might be brief.
        // But for toggle privacy, it's needed.
        // We can check if currentUserState.value is not null to assume we are still logged in?
        // Actually, logout clears the user.
        if (ref.read(currentUserProvider).value != null) {
          ToastUtils.showSuccess(
            context,
            title: 'Success',
            description: 'Settings updated successfully',
          );
        }
      }
    });

    return Scaffold(
      appBar: const CommonAppBar(title: 'Settings'),
      body: ListView(
        children: <Widget>[
          _buildSectionHeader('Account'),
          SwitchListTile(
            title: const Text('Private Account'),
            subtitle: const Text(
              'Only followers can see your photos and videos',
            ),
            value: user?.public == false, // If public is false, it is private
            onChanged: (bool value) {
              ref
                  .read(settingsControllerProvider.notifier)
                  .togglePrivacy(user?.public ?? true);
            },
            secondary: const Icon(LucideIcons.lock),
          ),
          ListTile(
            leading: const Icon(LucideIcons.user),
            title: const Text('Edit Profile'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              Navigator.of(context).pushNamed(Routes.editProfile);
            },
          ),
          ListTile(
            leading: const Icon(LucideIcons.key),
            title: const Text('Change Password'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              Navigator.of(context).pushNamed(Routes.changePassword);
            },
          ),
          ListTile(
            leading: const Icon(LucideIcons.ban),
            title: const Text('Blocked Users'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              Navigator.of(context).pushNamed(Routes.blockedUsers);
            },
          ),
          const Divider(),
          _buildSectionHeader('Preferences'),
          ListTile(
            leading: const Icon(LucideIcons.bell),
            title: const Text('Notifications'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              // TODO: Navigate to Notification Settings
            },
          ),
          ListTile(
            leading: const Icon(LucideIcons.languages),
            title: const Text('Language'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              // TODO: Navigate to Language Settings
            },
          ),
          const Divider(),
          ListTile(
            leading: Icon(LucideIcons.info),
            title: const Text('Help & Support'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {
              // TODO: Navigate to Help
            },
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton.icon(
              onPressed: state.isLoading
                  ? null
                  : () async {
                      await ref
                          .read(settingsControllerProvider.notifier)
                          .logout();
                      if (context.mounted) {
                        await Navigator.of(context).pushNamedAndRemoveUntil(
                          Routes.login,
                          (Route<dynamic> route) => false,
                        );
                      }
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade50,
                foregroundColor: Colors.red,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              icon: state.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.red,
                      ),
                    )
                  : const Icon(LucideIcons.logOut),
              label: Text(state.isLoading ? 'Logging out...' : 'Logout'),
            ),
          ),
          if (state.hasError)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                'Error: ${state.error}',
                style: const TextStyle(color: Colors.red),
                textAlign: TextAlign.center,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
        ),
      ),
    );
  }
}
