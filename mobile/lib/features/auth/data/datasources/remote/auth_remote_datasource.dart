import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';

class AuthRemoteDatasource {
  AuthRemoteDatasource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiAuthResponse> login({
    required String email,
    required String password,
    required String captchaToken,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authLogin,
            data: <String, String>{'email': email, 'password': password},
            options: Options(
              headers: <String, dynamic>{'X-Captcha-Token': captchaToken},
              extra: <String, dynamic>{'noAuth': true},
            ),
          );
      return ApiAuthResponse.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      String errorMsg = 'Login failed';
      if (responseData is Map<String, dynamic>) {
        errorMsg =
            (responseData['errorMessage'] as String?) ??
            (responseData['errorMessage'] as String?) ??
            'Login failed';
      }
      return ApiAuthResponse.error(errorMsg);
    }
  }

  Future<ApiAuthResponse> loginWithGoogle({required String idToken}) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authGoogleLogin,
            data: <String, String>{'idToken': idToken},
            options: Options(extra: <String, dynamic>{'noAuth': true}),
          );
      return ApiAuthResponse.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Google login failed'
          : 'Google login failed';
      return ApiAuthResponse.error(errorMsg);
    }
  }

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
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authSignup,
            data: <String, String>{
              'firstName': firstName,
              'lastName': lastName,
              'username': username,
              'email': email,
              'phone': phone,
              'password': password,
              'passwordConfirm': passwordConfirm,
              'dateOfBirth': dateOfBirth,
            },
            options: Options(
              headers: <String, dynamic>{'X-Register-Token': captchaToken},
              extra: <String, dynamic>{'noAuth': true},
            ),
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ??
                (responseData['errorMessage'] as String?) ??
                'Registration failed'
          : 'Registration failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseStatus> logout({required String token}) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authLogout,
            data: <String, String>{'token': token},
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Logout failed'
          : 'Logout failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseStatus> checkValidToken({required String token}) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authCheckValidToken,
            data: <String, String>{'token': token},
            options: Options(extra: <String, dynamic>{'noAuth': true}),
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ??
                'Check valid token failed'
          : 'Check valid token failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseStatus> verifyAccount({required String token}) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authVerifyAccount,
            data: <String, String>{'token': token},
            options: Options(extra: <String, dynamic>{'noAuth': true}),
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Verify account failed'
          : 'Verify account failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseStatus> forgotPassword({required String email}) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authForgotPassword,
            data: <String, String>{'email': email},
            options: Options(extra: <String, dynamic>{'noAuth': true}),
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ??
                'Forgot password failed'
          : 'Forgot password failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseStatus> resetPassword({
    required String token,
    required String password,
    required String passwordConfirm,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.authResetPassword,
            data: <String, String>{
              'token': token,
              'password': password,
              'passwordConfirm': passwordConfirm,
            },
            options: Options(extra: <String, dynamic>{'noAuth': true}),
          );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Reset password failed'
          : 'Reset password failed';
      return ApiResponseStatus.error(errorMsg);
    }
  }

  Future<ApiResponseObject<Map<String, dynamic>>> getProfile() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.authProfile);
      return ApiResponseObject<Map<String, dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Get profile failed'
          : 'Get profile failed';
      return ApiResponseObject<Map<String, dynamic>>.error(errorMsg);
    }
  }

  Future<ApiResponseObject<Map<String, dynamic>>> updateProfile({
    required FormData formData,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .put<Map<String, dynamic>>(
            ApiEndpoints.userUpdateProfile,
            data: formData,
          );
      return ApiResponseObject<Map<String, dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ?? 'Update profile failed'
          : 'Update profile failed';
      return ApiResponseObject<Map<String, dynamic>>.error(errorMsg);
    }
  }
}
