import '../../../../core/network/api_response.dart';
import '../entities/chat_entity.dart';

abstract class ChatRepository {
  /// Get list of all conversations for the user
  Future<ApiResponseObject<List<ConversationEntity>>> getConversations();

  /// Get messages for a specific conversation with cursor-based pagination
  Future<ApiResponseObject<List<ChatMessageEntity>>> getMessages({
    required String conversationId,
    String? cursor,
  });

  /// Find an existing private conversation with a user by username
  Future<ApiResponseObject<ConversationEntity>> findConversation(
    String username,
  );

  /// Create a new conversation (private or group)
  Future<ApiResponseObject<ConversationEntity>> createConversation({
    required List<String> usernames,
    String name = '',
  });

  /// Mark all messages in a conversation as read
  Future<ApiResponseStatus> markAsRead(String conversationId);

  /// Delete a conversation (and its messages)
  Future<ApiResponseStatus> deleteConversation(String conversationId);

  /// Get total count of unread conversations
  Future<ApiResponseObject<int>> getTotalUnreadCount();

  /// Toggle block status for a user
  Future<ApiResponseStatus> toggleBlock({
    required String username,
    required String action, // 'BLOCK' or 'UNBLOCK'
  });
}
