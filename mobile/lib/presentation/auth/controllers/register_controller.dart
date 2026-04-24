import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:dabble/shared/utils/app_log.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../states/register_state.dart';

class RegisterController extends StateNotifier<RegisterState> {
  RegisterController(this._ref) : super(const RegisterState());
  final Ref _ref;

  // ==================== Field Setters ====================

  void setFirstName(String value) {
    final String trimmed = value.trim();
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (trimmed.isEmpty) {
        error = 'First name is required';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      firstName: trimmed,
      firstNameError: error,
      clearFirstNameError: clear,
    );
  }

  void setLastName(String value) {
    final String trimmed = value.trim();
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (trimmed.isEmpty) {
        error = 'Last name is required';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      lastName: trimmed,
      lastNameError: error,
      clearLastNameError: clear,
    );
  }

  void setUsername(String value) {
    final String trimmed = value.trim();
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (trimmed.isEmpty) {
        error = 'Username is required';
      } else if (trimmed.length < 3) {
        error = 'Username must be at least 3 characters';
      } else if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(trimmed)) {
        error = 'Username can only contain letters, numbers, and underscores';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      username: trimmed,
      usernameError: error,
      clearUsernameError: clear,
    );
  }

  void setEmail(String value) {
    final String trimmed = value.trim();
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (trimmed.isEmpty) {
        error = 'Email is required';
      } else {
        final RegExp emailRegex = RegExp(
          r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        );
        if (!emailRegex.hasMatch(trimmed)) {
          error = 'Invalid email format';
        } else {
          clear = true;
        }
      }
    }

    state = state.copyWith(
      email: trimmed,
      emailError: error,
      clearEmailError: clear,
    );
  }

  void setPhone(String value) {
    final String trimmed = value.trim();
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (trimmed.isEmpty) {
        error = 'Phone number is required';
      } else if (!RegExp(r'^[0-9+\-\s()]+$').hasMatch(trimmed)) {
        error = 'Invalid phone number format';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      phone: trimmed,
      phoneError: error,
      clearPhoneError: clear,
    );
  }

  void setPassword(String value) {
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (value.isEmpty) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      password: value,
      passwordError: error,
      clearPasswordError: clear,
    );

    // Re-validate confirm password if already submitted
    if (state.hasSubmitted && state.passwordConfirm.isNotEmpty) {
      _validatePasswordConfirmOnChange();
    }
  }

  void setPasswordConfirm(String value) {
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (value.isEmpty) {
        error = 'Confirm password is required';
      } else if (value != state.password) {
        error = 'Passwords do not match';
      } else {
        clear = true;
      }
    }

    state = state.copyWith(
      passwordConfirm: value,
      passwordConfirmError: error,
      clearPasswordConfirmError: clear,
    );
  }

  void _validatePasswordConfirmOnChange() {
    String? error;
    bool clear = false;

    if (state.passwordConfirm.isEmpty) {
      error = 'Confirm password is required';
    } else if (state.passwordConfirm != state.password) {
      error = 'Passwords do not match';
    } else {
      clear = true;
    }

    state = state.copyWith(
      passwordConfirmError: error,
      clearPasswordConfirmError: clear,
    );
  }

  void setDateOfBirth(String value) {
    String? error;
    bool clear = false;

    if (state.hasSubmitted) {
      if (value.isEmpty) {
        error = 'Date of birth is required';
      } else {
        // Validate dd/MM/yyyy format
        final RegExp dateRegex = RegExp(r'^\d{2}/\d{2}/\d{4}$');
        if (!dateRegex.hasMatch(value)) {
          error = 'Invalid date format (dd/MM/yyyy)';
        } else {
          // Check if user is at least 18 years old
          final String? ageError = _validateAge18Plus(value);
          if (ageError != null) {
            error = ageError;
          } else {
            clear = true;
          }
        }
      }
    }

    state = state.copyWith(
      dateOfBirth: value,
      dateOfBirthError: error,
      clearDateOfBirthError: clear,
    );
  }

  String? _validateAge18Plus(String dateStr) {
    try {
      final List<String> parts = dateStr.split('/');
      final int day = int.parse(parts[0]);
      final int month = int.parse(parts[1]);
      final int year = int.parse(parts[2]);
      final DateTime dob = DateTime(year, month, day);
      final DateTime now = DateTime.now();
      final int age = now.year - dob.year;
      final bool hadBirthdayThisYear =
          now.month > dob.month ||
          (now.month == dob.month && now.day >= dob.day);
      final int actualAge = hadBirthdayThisYear ? age : age - 1;
      if (actualAge < 18) {
        return 'You must be at least 18 years old';
      }
      return null;
    } catch (e) {
      return 'Invalid date';
    }
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

  void togglePasswordConfirmVisibility() {
    state = state.copyWith(
      isPasswordConfirmVisible: !state.isPasswordConfirmVisible,
    );
  }

  // ==================== Validation ====================

  void _validateFirstName() {
    if (state.firstName.isEmpty) {
      state = state.copyWith(firstNameError: 'First name is required');
      return;
    }
    state = state.copyWith(clearFirstNameError: true);
  }

  void _validateLastName() {
    if (state.lastName.isEmpty) {
      state = state.copyWith(lastNameError: 'Last name is required');
      return;
    }
    state = state.copyWith(clearLastNameError: true);
  }

  void _validateUsername() {
    if (state.username.isEmpty) {
      state = state.copyWith(usernameError: 'Username is required');
      return;
    }
    if (state.username.length < 3) {
      state = state.copyWith(
        usernameError: 'Username must be at least 3 characters',
      );
      return;
    }
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(state.username)) {
      state = state.copyWith(
        usernameError:
            'Username can only contain letters, numbers, '
            'and underscores',
      );
      return;
    }
    state = state.copyWith(clearUsernameError: true);
  }

  void _validateEmail() {
    if (state.email.isEmpty) {
      state = state.copyWith(emailError: 'Email is required');
      return;
    }
    final RegExp emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.hasMatch(state.email)) {
      state = state.copyWith(emailError: 'Invalid email format');
      return;
    }
    state = state.copyWith(clearEmailError: true);
  }

  void _validatePhone() {
    if (state.phone.isEmpty) {
      state = state.copyWith(phoneError: 'Phone number is required');
      return;
    }
    if (!RegExp(r'^[0-9+\-\s()]+$').hasMatch(state.phone)) {
      state = state.copyWith(phoneError: 'Invalid phone number format');
      return;
    }
    state = state.copyWith(clearPhoneError: true);
  }

  void _validatePassword() {
    if (state.password.isEmpty) {
      state = state.copyWith(passwordError: 'Password is required');
      return;
    }
    if (state.password.length < 6) {
      state = state.copyWith(
        passwordError: 'Password must be at least 6 characters',
      );
      return;
    }
    state = state.copyWith(clearPasswordError: true);
  }

  void _validatePasswordConfirm() {
    if (state.passwordConfirm.isEmpty) {
      state = state.copyWith(
        passwordConfirmError: 'Confirm password is required',
      );
      return;
    }
    if (state.passwordConfirm != state.password) {
      state = state.copyWith(passwordConfirmError: 'Passwords do not match');
      return;
    }
    state = state.copyWith(clearPasswordConfirmError: true);
  }

  void _validateDateOfBirth() {
    if (state.dateOfBirth.isEmpty) {
      state = state.copyWith(dateOfBirthError: 'Date of birth is required');
      return;
    }
    final RegExp dateRegex = RegExp(r'^\d{2}/\d{2}/\d{4}$');
    if (!dateRegex.hasMatch(state.dateOfBirth)) {
      state = state.copyWith(
        dateOfBirthError: 'Invalid date format (dd/MM/yyyy)',
      );
      return;
    }
    // Check if user is at least 18 years old
    final String? ageError = _validateAge18Plus(state.dateOfBirth);
    if (ageError != null) {
      state = state.copyWith(dateOfBirthError: ageError);
      return;
    }
    state = state.copyWith(clearDateOfBirthError: true);
  }

  bool _hasValidationErrors() {
    return state.firstNameError != null ||
        state.lastNameError != null ||
        state.usernameError != null ||
        state.emailError != null ||
        state.phoneError != null ||
        state.passwordError != null ||
        state.passwordConfirmError != null ||
        state.dateOfBirthError != null;
  }

  // ==================== Register ====================

  Future<void> register(BuildContext context) async {
    state = state.copyWith(hasSubmitted: true);

    _validateFirstName();
    _validateLastName();
    _validateUsername();
    _validateEmail();
    _validatePhone();
    _validatePassword();
    _validatePasswordConfirm();
    _validateDateOfBirth();

    if (_hasValidationErrors()) {
      return;
    }

    if (!state.isFormValid) {
      state = state.copyWith(
        status: RegisterStatus.error,
        errorMessage: 'Please complete captcha',
      );
      return;
    }

    state = state.copyWith(
      status: RegisterStatus.loading,
      errorMessage: '',
      clearFirstNameError: true,
      clearLastNameError: true,
      clearUsernameError: true,
      clearEmailError: true,
      clearPhoneError: true,
      clearPasswordError: true,
      clearPasswordConfirmError: true,
      clearDateOfBirthError: true,
    );

    try {
      final ApiResponseStatus response = await _ref
          .read(registerUseCaseProvider)
          .call(
            firstName: state.firstName,
            lastName: state.lastName,
            username: state.username,
            email: state.email,
            phone: state.phone,
            password: state.password,
            passwordConfirm: state.passwordConfirm,
            dateOfBirth: state.dateOfBirth,
            captchaToken: state.captchaToken!,
          );

      if (response.isSuccess) {
        state = state.copyWith(
          status: RegisterStatus.success,
          successMessage: response.message,
        );
        if (context.mounted) {
          await Navigator.of(context).pushReplacementNamed(Routes.login);
        }
      } else {
        AppLog.error('Register failed: ${response.errorMessage}');
        state = state.copyWith(
          status: RegisterStatus.error,
          errorMessage: response.errorMessage,
          captchaToken: null,
          needsRefreshCaptcha: true,
        );
      }
    } catch (e) {
      state = state.copyWith(
        status: RegisterStatus.error,
        errorMessage: e.toString(),
        captchaToken: null,
        needsRefreshCaptcha: true,
      );
    }
  }

  void reset() {
    state = const RegisterState();
  }
}
