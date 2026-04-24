import '../../../../core/network/api_response.dart';
import '../../domain/entities/chat_entity.dart';
import '../../domain/repositories/chat_repository.dart';
import '../datasources/remote/chat_remote_datasource.dart';
import '../models/chat_model.dart';

class ChatRepositoryImpl implements ChatRepository {
  ChatRepositoryImpl(this._remoteDataSource);
  final ChatRemoteDataSource _remoteDataSource;

  @override
  Future<ApiResponseObject<List<ConversationEntity>>> getConversations() async {
    final ApiResponseObject<List<dynamic>> response = await _remoteDataSource
        .getConversations();

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<List<ConversationEntity>>(
        isSuccess: true,
        data: response.data!
            .map(
              (dynamic e) =>
                  ConversationModel.fromJson(e as Map<String, dynamic>),
            )
            .toList(),
        message: response.message,
        statusCode: response.statusCode,
      );
    }

    return ApiResponseObject<List<ConversationEntity>>(
      isSuccess: false,
      errorMessage: response.errorMessage,
      message: response.message,
      statusCode: response.statusCode,
    );
  }

  @override
  Future<ApiResponseObject<List<ChatMessageEntity>>> getMessages({
    required String conversationId,
    String? cursor,
  }) async {
    final ApiResponseObject<List<dynamic>> response = await _remoteDataSource
        .getMessages(conversationId: conversationId, cursor: cursor);

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<List<ChatMessageEntity>>(
        isSuccess: true,
        data: response.data!
            .map(
              (dynamic e) =>
                  ChatMessageModel.fromJson(e as Map<String, dynamic>),
            )
            .toList(),
        message: response.message,
        statusCode: response.statusCode,
      );
    }

    return ApiResponseObject<List<ChatMessageEntity>>(
      isSuccess: false,
      errorMessage: response.errorMessage,
      message: response.message,
      statusCode: response.statusCode,
    );
  }

  @override
  Future<ApiResponseObject<ConversationEntity>> findConversation(
    String username,
  ) async {
    final ApiResponseObject<Map<String, dynamic>> response =
        await _remoteDataSource.findConversation(username);

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<ConversationEntity>(
        isSuccess: true,
        data: ConversationModel.fromJson(response.data!),
        message: response.message,
        statusCode: response.statusCode,
      );
    }

    return ApiResponseObject<ConversationEntity>(
      isSuccess: false,
      errorMessage: response.errorMessage,
      message: response.message,
      statusCode: response.statusCode,
    );
  }

  @override
  Future<ApiResponseObject<ConversationEntity>> createConversation({
    required List<String> usernames,
    String name = '',
  }) async {
    final ApiResponseObject<Map<String, dynamic>> response =
        await _remoteDataSource.createConversation(
          usernames: usernames,
          name: name,
        );

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<ConversationEntity>(
        isSuccess: true,
        data: ConversationModel.fromJson(response.data!),
        message: response.message,
        statusCode: response.statusCode,
      );
    }

    return ApiResponseObject<ConversationEntity>(
      isSuccess: false,
      errorMessage: response.errorMessage,
      message: response.message,
      statusCode: response.statusCode,
    );
  }

  @override
  Future<ApiResponseStatus> deleteConversation(String conversationId) async {
    return await _remoteDataSource.deleteConversation(conversationId);
  }

  @override
  Future<ApiResponseObject<int>> getTotalUnreadCount() async {
    return await _remoteDataSource.getTotalUnreadCount();
  }

  @override
  Future<ApiResponseStatus> markAsRead(String conversationId) async {
    return const ApiResponseStatus(isSuccess: true);
  }

  @override
  Future<ApiResponseStatus> toggleBlock({
    required String username,
    required String action,
  }) async {
    return await _remoteDataSource.toggleBlock(
      username: username,
      action: action,
    );
  }
}
