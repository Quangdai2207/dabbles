import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../entities/profile_entity.dart';

abstract class AuthRepository {
  Future<ApiAuthResponse> login({
    required String email,
    required String password,
    required String captchaToken,
  });

  Future<ApiAuthResponse> loginWithGoogle({required String idToken});

  Future<ApiResponseStatus> register({
    required String firstName,
    required String lastName,
    required String username,
    required String email,
    required String phone,
    required String password,
    required String passwordConfirm,
    required String dateOfBirth,
    required String captchaToken,
  });

  Future<ApiResponseStatus> logout();

  Future<ApiResponseStatus> checkValidToken();

  Future<ApiResponseStatus> verifyAccount({required String token});

  Future<ApiResponseStatus> forgotPassword({required String email});

  Future<ApiResponseStatus> resetPassword({
    required String token,
    required String password,
    required String passwordConfirm,
  });

  Future<ApiResponseObject<ProfileEntity>> getProfile();

  Future<ApiResponseObject<ProfileEntity>> updateProfile({
    required FormData formData,
  });

  Future<bool> isLoggedIn();

  Future<String?> getToken();

  Future<String?> getAccountId();

  Future<void> clearAll();
}
