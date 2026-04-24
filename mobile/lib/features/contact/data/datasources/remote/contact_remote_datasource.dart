import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/contact_user_model.dart';

class ContactRemoteDataSource {
  ContactRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<List<ContactUserModel>>> _getList(String url) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(url);

      return ApiResponseObject<List<ContactUserModel>>.fromJson(
        response.data!,
        (Object? json) {
          if (json is List) {
            return json
                .map(
                  (Object? e) =>
                      ContactUserModel.fromJson(e as Map<String, dynamic>),
                )
                .toList();
          }
          return <ContactUserModel>[];
        },
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<ContactUserModel>>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get list failed',
      );
    }
  }

  Future<ApiResponseObject<List<ContactUserModel>>> getFollowers(
    String username,
  ) {
    return _getList('${ApiEndpoints.contactFollowers}/$username');
  }

  Future<ApiResponseObject<List<ContactUserModel>>> getFollowings(
    String username,
  ) {
    return _getList('${ApiEndpoints.contactFollowing}/$username');
  }

  Future<ApiResponseObject<List<ContactUserModel>>> getPending(
    String username,
  ) {
    return _getList('${ApiEndpoints.contactPending}/$username');
  }

  Future<ApiResponseObject<List<ContactUserModel>>> getBlocked() {
    return _getList(ApiEndpoints.contactGetAllBlocked);
  }

  Future<ApiResponseStatus> handleRequest(String username, String type) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.contactHandleRequest,
        data: <String, dynamic>{'username': username, 'typeOfRequest': type},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Handle request failed',
      );
    }
  }

  Future<ApiResponseStatus> handleAction(String username, String type) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.contactHandleAction,
        data: <String, dynamic>{'username': username, 'typeOfRequest': type},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Handle action failed',
      );
    }
  }

  Future<ApiResponseStatus> removeFollower(String username) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.contactRemoveFollower,
        data: <String, dynamic>{'username': username},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Remove follower failed',
      );
    }
  }
}
