import '../../../../core/network/api_response.dart';
import '../entities/chat_entity.dart';
import '../repositories/chat_repository.dart';

class GetConversationsUseCase {
  GetConversationsUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseObject<List<ConversationEntity>>> call() async {
    return await _repository.getConversations();
  }
}

class GetMessagesUseCase {
  GetMessagesUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseObject<List<ChatMessageEntity>>> call({
    required String conversationId,
    String? cursor,
  }) async {
    return await _repository.getMessages(
      conversationId: conversationId,
      cursor: cursor,
    );
  }
}

class FindConversationUseCase {
  FindConversationUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseObject<ConversationEntity>> call(String username) async {
    return await _repository.findConversation(username);
  }
}

class CreateConversationUseCase {
  CreateConversationUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseObject<ConversationEntity>> call({
    required List<String> usernames,
    String name = '',
  }) async {
    return await _repository.createConversation(
      usernames: usernames,
      name: name,
    );
  }
}

class MarkAsReadUseCase {
  MarkAsReadUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseStatus> call(String conversationId) async {
    return await _repository.markAsRead(conversationId);
  }
}

class DeleteConversationUseCase {
  DeleteConversationUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseStatus> call(String conversationId) async {
    return await _repository.deleteConversation(conversationId);
  }
}

class GetTotalUnreadCountUseCase {
  GetTotalUnreadCountUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseObject<int>> call() async {
    return await _repository.getTotalUnreadCount();
  }
}

class ToggleBlockUseCase {
  ToggleBlockUseCase(this._repository);
  final ChatRepository _repository;

  Future<ApiResponseStatus> call({
    required String username,
    required String action,
  }) async {
    return await _repository.toggleBlock(username: username, action: action);
  }
}
