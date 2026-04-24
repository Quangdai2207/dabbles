import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../entities/profile_entity.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase {
  LoginUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiAuthResponse> call({
    required String email,
    required String password,
    required String captchaToken,
  }) async {
    return await _repository.login(
      email: email,
      password: password,
      captchaToken: captchaToken,
    );
  }
}

class LoginWithGoogleUseCase {
  LoginWithGoogleUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiAuthResponse> call({required String idToken}) async {
    return await _repository.loginWithGoogle(idToken: idToken);
  }
}

class RegisterUseCase {
  RegisterUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseStatus> call({
    required String firstName,
    required String lastName,
    required String username,
    required String email,
    required String phone,
    required String password,
    required String passwordConfirm,
    required String dateOfBirth,
    required String captchaToken,
  }) async {
    return await _repository.register(
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      phone: phone,
      password: password,
      passwordConfirm: passwordConfirm,
      dateOfBirth: dateOfBirth,
      captchaToken: captchaToken,
    );
  }
}

class ForgotPasswordUseCase {
  ForgotPasswordUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseStatus> call({required String email}) async {
    return await _repository.forgotPassword(email: email);
  }
}

class ResetPasswordUseCase {
  ResetPasswordUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseStatus> call({
    required String token,
    required String password,
    required String passwordConfirm,
  }) async {
    return await _repository.resetPassword(
      token: token,
      password: password,
      passwordConfirm: passwordConfirm,
    );
  }
}

class GetProfileUseCase {
  GetProfileUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseObject<ProfileEntity>> call() async {
    return await _repository.getProfile();
  }
}

class UpdateProfileUseCase {
  UpdateProfileUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseObject<ProfileEntity>> call({
    required FormData formData,
  }) async {
    return await _repository.updateProfile(formData: formData);
  }
}

class LogoutUseCase {
  LogoutUseCase(this._repository);
  final AuthRepository _repository;

  Future<ApiResponseStatus> call() async {
    return await _repository.logout();
  }
}
