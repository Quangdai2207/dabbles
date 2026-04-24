import 'dart:io';

import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/features/user/domain/entities/user_entity.dart';
import 'package:dabble/features/user/injection/user_injection.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/utils/image_converter.dart';
import '../states/edit_profile_state.dart';

class EditProfileController extends StateNotifier<EditProfileState> {
  EditProfileController(this._ref) : super(const EditProfileState());

  final Ref _ref;

  Future<void> init(ProfileEntity? user) async {
    if (user != null) {
      state = state.copyWith(
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        username: user.username,
        phone: user.phone ?? '',
        dob: user.dob ?? '',
      );
    }
  }

  void setFirstName(String value) {
    state = state.copyWith(firstName: value, clearFirstNameError: true);
  }

  void setLastName(String value) {
    state = state.copyWith(lastName: value, clearLastNameError: true);
  }

  void setUsername(String value) {
    state = state.copyWith(username: value, clearUsernameError: true);
  }

  void setPhone(String value) {
    state = state.copyWith(phone: value, clearPhoneError: true);
  }

  void setDob(String value) {
    state = state.copyWith(dob: value, clearDobError: true);
  }

  void setAvatarPath(String? path) {
    state = state.copyWith(avatarPath: path);
  }

  bool validate() {
    bool isValid = true;
    String? firstNameError;
    String? lastNameError;
    String? usernameError;

    if (state.firstName.isEmpty) {
      firstNameError = 'First name is required';
      isValid = false;
    }

    if (state.lastName.isEmpty) {
      lastNameError = 'Last name is required';
      isValid = false;
    }

    if (state.username.isEmpty) {
      usernameError = 'Username is required';
      isValid = false;
    }

    state = state.copyWith(
      firstNameError: firstNameError,
      lastNameError: lastNameError,
      usernameError: usernameError,
    );

    return isValid;
  }

  Future<void> updateProfile() async {
    if (!validate()) return;

    state = state.copyWith(status: const AsyncLoading<void>());
    try {
      final Map<String, dynamic> data = <String, dynamic>{
        'firstName': state.firstName,
        'lastName': state.lastName,
        'username': state.username,
        'phone': state.phone,
        'dateOfBirth': state.dob,
      };

      String? finalAvatarPath = state.avatarPath;
      if (state.avatarPath != null &&
          state.avatarPath!.isNotEmpty &&
          !state.avatarPath!.startsWith('http')) {
        final File? converted = await ImageConverter.convertToJpg(
          state.avatarPath!,
        );
        if (converted != null) {
          finalAvatarPath = converted.path;
        }
      }

      final ApiResponseObject<UserEntity> result = await _ref
          .read(updateUserProfileUseCaseProvider)
          .call(data: data, avatarPath: finalAvatarPath);

      if (result.isSuccess) {
        // Refresh local profile
        await _ref.read(currentUserProvider.notifier).fetchProfile();
        state = state.copyWith(status: const AsyncData<void>(null));
      } else {
        state = state.copyWith(
          status: AsyncError<void>(
            result.errorMessage.isEmpty
                ? 'Update profile failed'
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
