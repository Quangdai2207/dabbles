import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ChangePasswordState extends Equatable {
  const ChangePasswordState({
    this.status = const AsyncData<void>(null),
    this.currentPassword = '',
    this.newPassword = '',
    this.confirmPassword = '',
    this.isCurrentPasswordVisible = false,
    this.isNewPasswordVisible = false,
    this.isConfirmPasswordVisible = false,
    this.currentPasswordError,
    this.newPasswordError,
    this.confirmPasswordError,
  });

  final AsyncValue<void> status;
  final String currentPassword;
  final String newPassword;
  final String confirmPassword;
  final bool isCurrentPasswordVisible;
  final bool isNewPasswordVisible;
  final bool isConfirmPasswordVisible;
  final String? currentPasswordError;
  final String? newPasswordError;
  final String? confirmPasswordError;

  bool get isValid =>
      currentPassword.isNotEmpty &&
      newPassword.isNotEmpty &&
      confirmPassword.isNotEmpty &&
      currentPasswordError == null &&
      newPasswordError == null &&
      confirmPasswordError == null;

  ChangePasswordState copyWith({
    AsyncValue<void>? status,
    String? currentPassword,
    String? newPassword,
    String? confirmPassword,
    bool? isCurrentPasswordVisible,
    bool? isNewPasswordVisible,
    bool? isConfirmPasswordVisible,
    String? currentPasswordError,
    String? newPasswordError,
    String? confirmPasswordError,
    bool clearCurrentPasswordError = false,
    bool clearNewPasswordError = false,
    bool clearConfirmPasswordError = false,
  }) {
    return ChangePasswordState(
      status: status ?? this.status,
      currentPassword: currentPassword ?? this.currentPassword,
      newPassword: newPassword ?? this.newPassword,
      confirmPassword: confirmPassword ?? this.confirmPassword,
      isCurrentPasswordVisible:
          isCurrentPasswordVisible ?? this.isCurrentPasswordVisible,
      isNewPasswordVisible: isNewPasswordVisible ?? this.isNewPasswordVisible,
      isConfirmPasswordVisible:
          isConfirmPasswordVisible ?? this.isConfirmPasswordVisible,
      currentPasswordError: clearCurrentPasswordError
          ? null
          : (currentPasswordError ?? this.currentPasswordError),
      newPasswordError: clearNewPasswordError
          ? null
          : (newPasswordError ?? this.newPasswordError),
      confirmPasswordError: clearConfirmPasswordError
          ? null
          : (confirmPasswordError ?? this.confirmPasswordError),
    );
  }

  @override
  List<Object?> get props => <Object?>[
    status,
    currentPassword,
    newPassword,
    confirmPassword,
    isCurrentPasswordVisible,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
  ];
}
