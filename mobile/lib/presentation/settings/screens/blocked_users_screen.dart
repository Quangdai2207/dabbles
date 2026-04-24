import 'package:dabble/features/contact/domain/entities/contact_user_entity.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_text_button.dart';
import 'package:dabble/shared/widgets/ui/common_app_bar.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/blocked_users_provider.dart';
import '../states/blocked_users_state.dart';

class BlockedUsersScreen extends ConsumerWidget {
  const BlockedUsersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final BlockedUsersState state = ref.watch(blockedUsersControllerProvider);

    return Scaffold(
      appBar: const CommonAppBar(title: 'Blocked Users'),
      body: state.status.when(
        data: (List<ContactUserEntity> users) {
          if (users.isEmpty) {
            return const Center(child: Text('No blocked users'));
          }
          return ListView.builder(
            itemCount: users.length,
            itemBuilder: (BuildContext context, int index) {
              final ContactUserEntity user = users[index];
              return ListTile(
                leading: UserAvatar(
                  avatarUrl: user.avatar,
                  name: user.username,
                  radius: 20,
                ),
                title: Text(
                  user.username,
                ), // ContactUserEntity might not have fullName
                trailing: AppTextButton(
                  onPressed: () async {
                    final String? error = await ref
                        .read(blockedUsersControllerProvider.notifier)
                        .unblockUser(user.username);
                    if (context.mounted && error != null) {
                      ToastUtils.showError(
                        context,
                        title: 'Unblock Failed',
                        description: error,
                      );
                    }
                  },
                  text: 'Unblock',
                  color: Colors.red,
                ),
              );
            },
          );
        },
        error: (Object error, StackTrace stackTrace) =>
            const Center(child: Text('No blocked users')),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
