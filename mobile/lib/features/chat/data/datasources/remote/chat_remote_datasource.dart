import 'package:dio/dio.dart';
import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';

class ChatRemoteDataSource {
  ChatRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<List<dynamic>>> getConversations() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.conversationGetConversations);
      return ApiResponseObject<List<dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as List<dynamic>,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<dynamic>>.error(
        e.message ?? 'Failed to get conversations',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseObject<List<dynamic>>> getMessages({
    required String conversationId,
    String? cursor,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(
            '${ApiEndpoints.chatGetMessages}/$conversationId',
            queryParameters: <String, dynamic>{'cursor': cursor ?? ''},
          );
      return ApiResponseObject<List<dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as List<dynamic>,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<dynamic>>.error(
        e.message ?? 'Failed to get messages',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseObject<Map<String, dynamic>>> findConversation(
    String username,
  ) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(
            '${ApiEndpoints.conversationFindConversation}/$username',
          );
      return ApiResponseObject<Map<String, dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as Map<String, dynamic>,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseObject<Map<String, dynamic>>.error(
        e.message ?? 'Conversation not found',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseObject<Map<String, dynamic>>> createConversation({
    required List<String> usernames,
    String name = '',
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.conversationCreateConversation,
            data: <String, Object>{'usernames': usernames, 'name': name},
          );
      return ApiResponseObject<Map<String, dynamic>>.fromJson(
        response.data!,
        (Object? json) => json as Map<String, dynamic>,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseObject<Map<String, dynamic>>.error(
        e.message ?? 'Failed to create conversation',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseStatus> deleteConversation(String conversationId) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .delete<Map<String, dynamic>>(
            '${ApiEndpoints.conversationDelete}/$conversationId',
          );
      return ApiResponseStatus.fromJson(
        response.data!,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        e.message ?? 'Failed to delete conversation',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseObject<int>> getTotalUnreadCount() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.conversationTotalUnread);
      return ApiResponseObject<int>.fromJson(
        response.data!,
        (Object? json) => json as int,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseObject<int>.error(
        e.message ?? 'Failed to get unread count',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<ApiResponseStatus> toggleBlock({
    required String username,
    required String action,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .post<Map<String, dynamic>>(
            ApiEndpoints.contactHandleAction,
            data: <String, String>{
              'username': username,
              'typeOfRequest': action,
            },
          );
      return ApiResponseStatus.fromJson(
        response.data!,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        e.message ?? 'Failed to toggle block status',
        statusCode: e.response?.statusCode,
      );
    }
  }
}
