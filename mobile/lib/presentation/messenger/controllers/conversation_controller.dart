import 'package:dabble/core/network/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/injection/export_injection.dart';
import '../../../features/chat/data/models/chat_model.dart';
import '../../../features/chat/domain/entities/chat_entity.dart';
import '../../../shared/utils/app_log.dart';
import '../states/chat_state.dart';

class ConversationController extends StateNotifier<ConversationState> {
  ConversationController(this._ref) : super(const ConversationState());
  final Ref _ref;

  Future<void> init() async {
    await fetchConversations();
    await fetchTotalUnreadCount();
    // Socket subscription handled centrally
  }

  void handleSocketMessage(Map<String, dynamic> data) {
    try {
      if (data['totalUnreadConversation'] != null) {
        setTotalUnread(data['totalUnreadConversation'] as int);
      }

      if (data['conversationResponseForChatBoxDto'] != null) {
        final ConversationModel conversation = ConversationModel.fromJson(
          data['conversationResponseForChatBoxDto'] as Map<String, dynamic>,
        );
        updateConversation(conversation);
      }
    } catch (e) {
      AppLog.error('Error processing chat update', e);
    }
  }

  // _subscribeToUpdates removed as it is handled by the central socket provider

  Future<void> fetchConversations() async {
    state = state.copyWith(status: ChatStatus.loading);
    try {
      final ApiResponseObject<List<ConversationEntity>> response = await _ref
          .read(getConversationsUseCaseProvider)
          .call();

      if (response.isSuccess && response.data != null) {
        state = state.copyWith(
          conversations: response.data,
          status: ChatStatus.success,
        );
      } else {
        state = state.copyWith(
          status: ChatStatus.error,
          errorMessage: response.errorMessage,
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      state = state.copyWith(
        status: ChatStatus.error,
        errorMessage: 'Failed to load conversations: ${e.toString()}',
      );
    }
  }

  Future<void> fetchTotalUnreadCount() async {
    final ApiResponseObject<int> response = await _ref
        .read(getTotalUnreadCountUseCaseProvider)
        .call();
    if (response.isSuccess && response.data != null) {
      state = state.copyWith(totalUnreadCount: response.data);
    }
  }

  void updateConversation(ConversationEntity conversation) {
    final List<ConversationEntity> currentConversations =
        List<ConversationEntity>.from(state.conversations);
    final int index = currentConversations.indexWhere(
      (ConversationEntity c) => c.id == conversation.id,
    );

    if (index != -1) {
      currentConversations[index] = conversation;
    } else {
      currentConversations.insert(0, conversation);
    }

    // Sort by last message time
    currentConversations.sort((ConversationEntity a, ConversationEntity b) {
      final DateTime aTime =
          a.lastMessageAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      final DateTime bTime =
          b.lastMessageAt ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bTime.compareTo(aTime);
    });

    state = state.copyWith(conversations: currentConversations);
  }

  void setTotalUnread(int count) {
    state = state.copyWith(totalUnreadCount: count);
  }

  void markConversationAsRead(String conversationId) {
    final List<ConversationEntity> currentConversations =
        List<ConversationEntity>.from(state.conversations);
    final int index = currentConversations.indexWhere(
      (ConversationEntity c) => c.id == conversationId,
    );

    if (index != -1) {
      final ConversationEntity conversation = currentConversations[index];
      if (conversation.unreadMessageCount > 0) {
        // Decrease total unread count
        final int currentTotal = state.totalUnreadCount;
        state = state.copyWith(
          totalUnreadCount: currentTotal > 0 ? currentTotal - 1 : 0,
        );

        // Update specific conversation
        currentConversations[index] = ConversationModel(
          id: conversation.id,
          name: conversation.name,
          type: conversation.isGroup ? 'GROUP' : 'PRIVATE',
          participantModels:
              (conversation as ConversationModel).participantModels,
          lastMessage: conversation.lastMessage,
          lastMessageAtUtc: conversation.lastMessageAt,
          unreadMessageCount: 0,
          blockStatus: conversation.blockStatus,
          avatar: conversation.avatar,
          createdAtUtc: conversation.createdAt,
        );

        state = state.copyWith(conversations: currentConversations);
      }
    }
  }
}

final StateNotifierProvider<ConversationController, ConversationState>
conversationControllerProvider =
    StateNotifierProvider<ConversationController, ConversationState>((Ref ref) {
      return ConversationController(ref);
    });
