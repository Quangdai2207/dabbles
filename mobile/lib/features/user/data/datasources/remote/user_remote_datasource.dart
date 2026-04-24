import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/user_basic_model.dart';
import '../../models/user_model.dart';

class UserRemoteDataSource {
  UserRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<UserModel>> getUserProfile(String? userId) async {
    try {
      final String url = userId != null
          ? '${ApiEndpoints.userGetProfile}/$userId'
          : ApiEndpoints.userGetProfile;

      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(url);

      return ApiResponseObject<UserModel>.fromJson(
        response.data!,
        (Object? json) => UserModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      return ApiResponseObject<UserModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Get profile failed',
      );
    }
  }

  Future<ApiResponseObject<List<UserBasicModel>>> searchUsers(
    String query,
  ) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.get(
        '${ApiEndpoints.userSearch}/$query',
      );

      final dynamic listData = response.data?['data'];
      if (listData is List) {
        final List<UserBasicModel> list = listData
            .map(
              (dynamic e) => UserBasicModel.fromJson(e as Map<String, dynamic>),
            )
            .toList();
        return ApiResponseObject<List<UserBasicModel>>(
          isSuccess: true,
          data: list,
        );
      }
      return ApiResponseObject<List<UserBasicModel>>(
        isSuccess: true,
        data: <UserBasicModel>[],
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<UserBasicModel>>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Search failed',
      );
    }
  }

  Future<ApiResponseObject<UserModel>> updateProfile(Object data) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.put(
        ApiEndpoints.userUpdateProfile,
        data: data,
      );

      return ApiResponseObject<UserModel>.fromJson(
        response.data!,
        (Object? json) => UserModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      return ApiResponseObject<UserModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Update failed',
      );
    }
  }

  Future<ApiResponseStatus> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.put(
        ApiEndpoints.userChangePassword,
        data: <String, String>{
          'currentPassword': currentPassword,
          'password': newPassword,
          'passwordConfirm':
              newPassword, // Assuming newPassword is used for both if signature only has newPassword
        },
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Change password failed',
      );
    }
  }

  Future<ApiResponseStatus> togglePrivacy() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.put(
        ApiEndpoints.userTogglePrivacy,
        data: <String, dynamic>{},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Toggle privacy failed',
      );
    }
  }
}
