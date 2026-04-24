import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:dabble/shared/widgets/ui/app_text_field.dart';
import 'package:dabble/shared/widgets/ui/common_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../controllers/change_password_controller.dart';
import '../providers/change_password_provider.dart';
import '../states/change_password_state.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() =>
      _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final TextEditingController _currentPasswordController =
      TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _passwordConfirmController =
      TextEditingController();

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _passwordController.dispose();
    _passwordConfirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ChangePasswordState state = ref.watch(
      changePasswordControllerProvider,
    );
    final ChangePasswordController controller = ref.read(
      changePasswordControllerProvider.notifier,
    );

    ref.listen(changePasswordControllerProvider, (
      ChangePasswordState? previous,
      ChangePasswordState next,
    ) {
      if (next.status.hasError) {
        ToastUtils.showError(
          context,
          title: 'Change Password Failed',
          description: next.status.error.toString(),
        );
      } else if (next.status is AsyncData && previous?.status is AsyncLoading) {
        ToastUtils.showSuccess(
          context,
          title: 'Success',
          description: 'Password changed successfully',
        );
        Navigator.of(context).pop();
      }
    });

    return Scaffold(
      appBar: const CommonAppBar(title: 'Change Password'),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: <Widget>[
            AppTextField(
              controller: _currentPasswordController,
              label: 'Current Password',
              hint: 'Enter your current password',
              obscureText: !state.isCurrentPasswordVisible,
              prefixIcon: LucideIcons.lock,
              suffixIcon: IconButton(
                icon: Icon(
                  state.isCurrentPasswordVisible
                      ? LucideIcons.eyeOff
                      : LucideIcons.eye,
                ),
                onPressed: controller.toggleCurrentPasswordVisibility,
              ),
              errorMessage: state.currentPasswordError,
              onChanged: controller.setCurrentPassword,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _passwordController,
              label: 'New Password',
              hint: 'Enter new password',
              obscureText: !state.isNewPasswordVisible,
              prefixIcon: LucideIcons.key,
              suffixIcon: IconButton(
                icon: Icon(
                  state.isNewPasswordVisible
                      ? LucideIcons.eyeOff
                      : LucideIcons.eye,
                ),
                onPressed: controller.toggleNewPasswordVisibility,
              ),
              errorMessage: state.newPasswordError,
              onChanged: controller.setNewPassword,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _passwordConfirmController,
              label: 'Confirm Password',
              hint: 'Confirm new password',
              obscureText: !state.isConfirmPasswordVisible,
              prefixIcon: LucideIcons.key,
              suffixIcon: IconButton(
                icon: Icon(
                  state.isConfirmPasswordVisible
                      ? LucideIcons.eyeOff
                      : LucideIcons.eye,
                ),
                onPressed: controller.toggleConfirmPasswordVisibility,
              ),
              errorMessage: state.confirmPasswordError,
              onChanged: controller.setConfirmPassword,
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Change Password',
              isLoading: state.status.isLoading,
              onPressed: controller.changePassword,
            ),
          ],
        ),
      ),
    );
  }
}
