import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:dabble/shared/utils/app_log.dart';
import 'package:dabble/shared/utils/session_utils.dart';
import 'package:dabble/shared/utils/validators.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../states/login_state.dart';

class LoginController extends StateNotifier<LoginState> {
  LoginController(this._ref) : super(const LoginState());
  final Ref _ref;

  void setEmail(String value) {
    final String trimmedEmail = value.trim();
    String? emailError;
    bool clearEmailError = false;

    if (state.hasSubmitted) {
      if (trimmedEmail.isEmpty) {
        emailError = 'Email is required';
      } else {
        if (!Validators.isValidEmail(trimmedEmail)) {
          emailError = 'Invalid email format';
        } else {
          clearEmailError = true;
        }
      }
    }

    state = state.copyWith(
      email: trimmedEmail,
      emailError: emailError,
      clearEmailError: clearEmailError,
    );
  }

  void setPassword(String value) {
    String? passwordError;
    bool clearPasswordError = false;

    if (state.hasSubmitted) {
      if (value.isEmpty) {
        passwordError = 'Password is required';
      } else {
        clearPasswordError = true;
      }
    }

    state = state.copyWith(
      password: value,
      passwordError: passwordError,
      clearPasswordError: clearPasswordError,
    );
  }

  void setCaptchaToken(String? token) {
    state = state.copyWith(captchaToken: token, needsRefreshCaptcha: false);
  }

  void clearRefreshCaptchaFlag() {
    state = state.copyWith(needsRefreshCaptcha: false);
  }

  void togglePasswordVisibility() {
    state = state.copyWith(isPasswordVisible: !state.isPasswordVisible);
  }

  void _validateEmail() {
    final String email = state.email;
    final String? error = Validators.validateEmail(email);
    if (error != null) {
      state = state.copyWith(emailError: error);
      return;
    }

    state = state.copyWith(clearEmailError: true);
  }

  void _validatePassword() {
    final String password = state.password;
    final String? error = Validators.validatePassword(password);
    if (error != null) {
      state = state.copyWith(passwordError: error);
      return;
    }

    state = state.copyWith(clearPasswordError: true);
  }

  Future<bool> login() async {
    state = state.copyWith(hasSubmitted: true);

    _validateEmail();
    _validatePassword();

    if (state.emailError != null || state.passwordError != null) {
      return false;
    }

    if (!state.isFormValid) {
      state = state.copyWith(
        status: LoginStatus.error,
        errorMessage: 'Please complete captcha',
      );
      return false;
    }

    state = state.copyWith(
      status: LoginStatus.loading,
      errorMessage: '',
      clearEmailError: true,
      clearPasswordError: true,
    );

    try {
      final ApiAuthResponse response = await _ref
          .read(loginUseCaseProvider)
          .call(
            email: state.email,
            password: state.password,
            captchaToken: state.captchaToken!,
          );

      if (response.isSuccess) {
        _invalidateUserSession();

        state = state.copyWith(status: LoginStatus.success);
        return true;
      } else {
        AppLog.error('Login failed: ${response.errorMessage}');
        state = state.copyWith(
          status: LoginStatus.error,
          errorMessage: response.errorMessage,
          captchaToken: null,
          needsRefreshCaptcha: true,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        status: LoginStatus.error,
        errorMessage: e.toString(),
        captchaToken: null,
        needsRefreshCaptcha: true,
      );
      return false;
    }
  }

  Future<bool> loginWithGoogle() async {
    state = state.copyWith(isGoogleLoading: true, errorMessage: '');
    try {
      // 1. Sign in with Google SDK
      final GoogleSignInAuthentication? googleAuth = await _ref
          .read(googleSignInServiceProvider)
          .signIn();

      if (googleAuth == null) {
        // User cancelled or error (logged in service)
        state = state.copyWith(isGoogleLoading: false);
        return false;
      }

      final String? idToken = googleAuth.idToken;
      if (idToken == null) {
        state = state.copyWith(
          isGoogleLoading: false,
          errorMessage: 'Failed to retrieve Google ID Token',
        );
        return false;
      }

      // 2. Call Backend API
      final ApiAuthResponse response = await _ref
          .read(loginWithGoogleUseCaseProvider)
          .call(idToken: idToken);

      if (response.isSuccess) {
        _invalidateUserSession();

        state = state.copyWith(
          status: LoginStatus.success,
          isGoogleLoading: false,
        );
        return true;
      } else {
        AppLog.error('Google Login failed: ${response.errorMessage}');
        state = state.copyWith(
          status: LoginStatus.error,
          errorMessage: response.errorMessage,
          isGoogleLoading: false,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        status: LoginStatus.error,
        errorMessage: e.toString(),
        isGoogleLoading: false,
      );
      return false;
    }
  }

  void _invalidateUserSession() {
    _ref.read(authStateProvider.notifier).authenticate();
    // Force refresh all user data
    SessionUtils.invalidateUserSession(_ref);
  }

  void reset() {
    state = const LoginState();
  }
}
