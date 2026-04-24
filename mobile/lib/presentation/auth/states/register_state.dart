import 'package:equatable/equatable.dart';

enum RegisterStatus { initial, loading, success, error }

class RegisterState extends Equatable {
  const RegisterState({
    this.status = RegisterStatus.initial,
    this.firstName = '',
    this.lastName = '',
    this.username = '',
    this.email = '',
    this.phone = '',
    this.password = '',
    this.passwordConfirm = '',
    this.dateOfBirth = '',
    this.captchaToken,
    this.errorMessage,
    this.successMessage,
    this.isPasswordVisible = false,
    this.isPasswordConfirmVisible = false,
    this.needsRefreshCaptcha = false,
    this.firstNameError,
    this.lastNameError,
    this.usernameError,
    this.emailError,
    this.phoneError,
    this.passwordError,
    this.passwordConfirmError,
    this.dateOfBirthError,
    this.hasSubmitted = false,
  });

  final RegisterStatus status;
  final String firstName;
  final String lastName;
  final String username;
  final String email;
  final String phone;
  final String password;
  final String passwordConfirm;
  final String dateOfBirth;
  final String? captchaToken;
  final String? errorMessage;
  final String? successMessage;
  final bool isPasswordVisible;
  final bool isPasswordConfirmVisible;
  final bool needsRefreshCaptcha;
  final String? firstNameError;
  final String? lastNameError;
  final String? usernameError;
  final String? emailError;
  final String? phoneError;
  final String? passwordError;
  final String? passwordConfirmError;
  final String? dateOfBirthError;
  final bool hasSubmitted;

  bool get isFormValid =>
      firstName.isNotEmpty &&
      lastName.isNotEmpty &&
      username.isNotEmpty &&
      email.isNotEmpty &&
      phone.isNotEmpty &&
      password.isNotEmpty &&
      passwordConfirm.isNotEmpty &&
      password == passwordConfirm &&
      dateOfBirth.isNotEmpty &&
      captchaToken != null;

  RegisterState copyWith({
    RegisterStatus? status,
    String? firstName,
    String? lastName,
    String? username,
    String? email,
    String? phone,
    String? password,
    String? passwordConfirm,
    String? dateOfBirth,
    String? captchaToken,
    String? errorMessage,
    String? successMessage,
    bool? isPasswordVisible,
    bool? isPasswordConfirmVisible,
    bool? needsRefreshCaptcha,
    String? firstNameError,
    String? lastNameError,
    String? usernameError,
    String? emailError,
    String? phoneError,
    String? passwordError,
    String? passwordConfirmError,
    String? dateOfBirthError,
    bool? hasSubmitted,
    bool clearFirstNameError = false,
    bool clearLastNameError = false,
    bool clearUsernameError = false,
    bool clearEmailError = false,
    bool clearPhoneError = false,
    bool clearPasswordError = false,
    bool clearPasswordConfirmError = false,
    bool clearDateOfBirthError = false,
  }) {
    return RegisterState(
      status: status ?? this.status,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      username: username ?? this.username,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      password: password ?? this.password,
      passwordConfirm: passwordConfirm ?? this.passwordConfirm,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      captchaToken: captchaToken ?? this.captchaToken,
      errorMessage: errorMessage,
      successMessage: successMessage,
      isPasswordVisible: isPasswordVisible ?? this.isPasswordVisible,
      isPasswordConfirmVisible:
          isPasswordConfirmVisible ?? this.isPasswordConfirmVisible,
      needsRefreshCaptcha: needsRefreshCaptcha ?? this.needsRefreshCaptcha,
      firstNameError: clearFirstNameError
          ? null
          : (firstNameError ?? this.firstNameError),
      lastNameError: clearLastNameError
          ? null
          : (lastNameError ?? this.lastNameError),
      usernameError: clearUsernameError
          ? null
          : (usernameError ?? this.usernameError),
      emailError: clearEmailError ? null : (emailError ?? this.emailError),
      phoneError: clearPhoneError ? null : (phoneError ?? this.phoneError),
      passwordError: clearPasswordError
          ? null
          : (passwordError ?? this.passwordError),
      passwordConfirmError: clearPasswordConfirmError
          ? null
          : (passwordConfirmError ?? this.passwordConfirmError),
      dateOfBirthError: clearDateOfBirthError
          ? null
          : (dateOfBirthError ?? this.dateOfBirthError),
      hasSubmitted: hasSubmitted ?? this.hasSubmitted,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    status,
    firstName,
    lastName,
    username,
    email,
    phone,
    password,
    passwordConfirm,
    dateOfBirth,
    captchaToken,
    errorMessage,
    successMessage,
    isPasswordVisible,
    isPasswordConfirmVisible,
    needsRefreshCaptcha,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    phoneError,
    passwordError,
    passwordConfirmError,
    dateOfBirthError,
    hasSubmitted,
  ];
}
