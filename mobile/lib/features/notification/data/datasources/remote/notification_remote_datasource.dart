import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/notification_model.dart';

class NotificationRemoteDataSource {
  NotificationRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<int>> getTotalUnread() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.notificationTotalUnread);

      final dynamic data = response.data?['data'];
      final int count = data is int
          ? data
          : ((data as Map<String, dynamic>?)?['totalNotifications'] as int? ??
                0);

      return ApiResponseObject<int>(isSuccess: true, data: count);
    } on DioException catch (e) {
      return ApiResponseObject<int>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get unread count failed',
      );
    }
  }

  Future<ApiResponseObject<List<NotificationModel>>> getNotifications({
    int page = 0,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(
            ApiEndpoints.notificationGetNotifications,
            queryParameters: <String, dynamic>{'page': page},
          );

      final dynamic listData = response.data?['data'] is Map
          ? (response.data!['data'] as Map<String, dynamic>)['notifications']
          : response.data?['data'];

      if (listData is List) {
        final List<NotificationModel> list = listData
            .map(
              (dynamic e) =>
                  NotificationModel.fromJson(e as Map<String, dynamic>),
            )
            .toList();
        return ApiResponseObject<List<NotificationModel>>(
          isSuccess: true,
          data: list,
        );
      }
      return ApiResponseObject<List<NotificationModel>>(
        isSuccess: true,
        data: <NotificationModel>[],
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<NotificationModel>>.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Get notifications failed',
      );
    }
  }

  Future<ApiResponseStatus> markAllAsRead() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.put(
        ApiEndpoints.notificationMarkReadAll,
        data: <String, dynamic>{},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Mark all read failed',
      );
    }
  }

  Future<ApiResponseStatus> markAsRead(String id) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.put(
        '${ApiEndpoints.notificationMarkRead}/$id',
        data: <String, dynamic>{},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Mark read failed',
      );
    }
  }

  Future<ApiResponseStatus> deleteNotification(String id) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.delete(
        '${ApiEndpoints.notificationRemove}/$id',
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Delete failed',
      );
    }
  }
}
