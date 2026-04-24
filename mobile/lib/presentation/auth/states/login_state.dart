import 'package:equatable/equatable.dart';

enum LoginStatus { initial, loading, success, error }

class LoginState extends Equatable {
  const LoginState({
    this.status = LoginStatus.initial,
    this.email = '',
    this.password = '',
    this.captchaToken,
    this.errorMessage,
    this.isPasswordVisible = false,
    this.needsRefreshCaptcha = false,
    this.emailError,
    this.passwordError,
    this.hasSubmitted = false,
    this.isGoogleLoading = false,
  });

  final LoginStatus status;
  final String email;
  final String password;
  final String? captchaToken;
  final String? errorMessage;
  final bool isPasswordVisible;
  final bool needsRefreshCaptcha;
  final String? emailError;
  final String? passwordError;
  final bool hasSubmitted;
  final bool isGoogleLoading;

  bool get isFormValid =>
      email.isNotEmpty && password.isNotEmpty && captchaToken != null;

  LoginState copyWith({
    LoginStatus? status,
    String? email,
    String? password,
    String? captchaToken,
    String? errorMessage,
    bool? isPasswordVisible,
    bool? needsRefreshCaptcha,
    String? emailError,
    String? passwordError,
    bool? hasSubmitted,
    bool? isGoogleLoading,
    bool clearEmailError = false,
    bool clearPasswordError = false,
  }) {
    return LoginState(
      status: status ?? this.status,
      email: email ?? this.email,
      password: password ?? this.password,
      captchaToken: captchaToken ?? this.captchaToken,
      errorMessage: errorMessage,
      isPasswordVisible: isPasswordVisible ?? this.isPasswordVisible,
      needsRefreshCaptcha: needsRefreshCaptcha ?? this.needsRefreshCaptcha,
      emailError: clearEmailError ? null : (emailError ?? this.emailError),
      passwordError: clearPasswordError
          ? null
          : (passwordError ?? this.passwordError),
      hasSubmitted: hasSubmitted ?? this.hasSubmitted,
      isGoogleLoading: isGoogleLoading ?? this.isGoogleLoading,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    status,
    email,
    password,
    captchaToken,
    errorMessage,
    isPasswordVisible,
    needsRefreshCaptcha,
    emailError,
    passwordError,
    hasSubmitted,
    isGoogleLoading,
  ];
}
