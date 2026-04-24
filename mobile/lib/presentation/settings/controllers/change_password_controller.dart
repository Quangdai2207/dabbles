import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/user/injection/user_injection.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../states/change_password_state.dart';

class ChangePasswordController extends StateNotifier<ChangePasswordState> {
  ChangePasswordController(this._ref) : super(const ChangePasswordState());

  final Ref _ref;

  void setCurrentPassword(String value) {
    state = state.copyWith(
      currentPassword: value,
      clearCurrentPasswordError: true,
    );
  }

  void setNewPassword(String value) {
    state = state.copyWith(newPassword: value, clearNewPasswordError: true);
  }

  void setConfirmPassword(String value) {
    state = state.copyWith(
      confirmPassword: value,
      clearConfirmPasswordError: true,
    );
  }

  void toggleCurrentPasswordVisibility() {
    state = state.copyWith(
      isCurrentPasswordVisible: !state.isCurrentPasswordVisible,
    );
  }

  void toggleNewPasswordVisibility() {
    state = state.copyWith(isNewPasswordVisible: !state.isNewPasswordVisible);
  }

  void toggleConfirmPasswordVisibility() {
    state = state.copyWith(
      isConfirmPasswordVisible: !state.isConfirmPasswordVisible,
    );
  }

  bool validate() {
    bool isValid = true;
    String? currentPasswordError;
    String? newPasswordError;
    String? confirmPasswordError;

    if (state.currentPassword.isEmpty) {
      currentPasswordError = 'Current password is required';
      isValid = false;
    }

    if (state.newPassword.isEmpty) {
      newPasswordError = 'New password is required';
      isValid = false;
    } else if (state.newPassword.length < 6) {
      newPasswordError = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (state.confirmPassword.isEmpty) {
      confirmPasswordError = 'Confirm password is required';
      isValid = false;
    } else if (state.newPassword != state.confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    state = state.copyWith(
      currentPasswordError: currentPasswordError,
      newPasswordError: newPasswordError,
      confirmPasswordError: confirmPasswordError,
    );

    return isValid;
  }

  Future<void> changePassword() async {
    if (!validate()) return;

    state = state.copyWith(status: const AsyncLoading<void>());
    try {
      final ApiResponseStatus result = await _ref
          .read(changePasswordUseCaseProvider)
          .call(state.currentPassword, state.newPassword);

      if (result.isSuccess) {
        state = state.copyWith(status: const AsyncData<void>(null));
      } else {
        state = state.copyWith(
          status: AsyncError<void>(
            result.errorMessage.isEmpty
                ? 'Change password failed'
                : result.errorMessage,
            StackTrace.current,
          ),
        );
      }
    } catch (e, st) {
      state = state.copyWith(status: AsyncError<void>(e, st));
    }
  }
}
