import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class EditProfileState extends Equatable {
  const EditProfileState({
    this.status = const AsyncData<void>(null),
    this.firstName = '',
    this.lastName = '',
    this.username = '',
    this.phone = '',
    this.dob = '',
    this.avatarPath,
    this.firstNameError,
    this.lastNameError,
    this.usernameError,
    this.phoneError,
    this.dobError,
  });

  final AsyncValue<void> status;
  final String firstName;
  final String lastName;
  final String username;
  final String phone;
  final String dob;
  final String? avatarPath;
  final String? firstNameError;
  final String? lastNameError;
  final String? usernameError;
  final String? phoneError;
  final String? dobError;

  bool get isValid =>
      firstName.isNotEmpty &&
      lastName.isNotEmpty &&
      username.isNotEmpty &&
      firstNameError == null &&
      lastNameError == null &&
      usernameError == null &&
      phoneError == null &&
      dobError == null;

  EditProfileState copyWith({
    AsyncValue<void>? status,
    String? firstName,
    String? lastName,
    String? username,
    String? phone,
    String? dob,
    String? avatarPath,
    String? firstNameError,
    String? lastNameError,
    String? usernameError,
    String? phoneError,
    String? dobError,
    bool clearAvatarPath = false,
    bool clearFirstNameError = false,
    bool clearLastNameError = false,
    bool clearUsernameError = false,
    bool clearPhoneError = false,
    bool clearDobError = false,
  }) {
    return EditProfileState(
      status: status ?? this.status,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      username: username ?? this.username,
      phone: phone ?? this.phone,
      dob: dob ?? this.dob,
      avatarPath: clearAvatarPath ? null : (avatarPath ?? this.avatarPath),
      firstNameError: clearFirstNameError
          ? null
          : (firstNameError ?? this.firstNameError),
      lastNameError: clearLastNameError
          ? null
          : (lastNameError ?? this.lastNameError),
      usernameError: clearUsernameError
          ? null
          : (usernameError ?? this.usernameError),
      phoneError: clearPhoneError ? null : (phoneError ?? this.phoneError),
      dobError: clearDobError ? null : (dobError ?? this.dobError),
    );
  }

  @override
  List<Object?> get props => <Object?>[
    status,
    firstName,
    lastName,
    username,
    phone,
    dob,
    avatarPath,
    firstNameError,
    lastNameError,
    usernameError,
    phoneError,
    dobError,
  ];
}
