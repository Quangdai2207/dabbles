import 'dart:convert';

import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/core/network/socket_service.dart';
import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

import '../../../core/injection/export_injection.dart';
import '../../../features/chat/data/models/chat_model.dart';
import '../../../features/chat/domain/entities/chat_entity.dart';
import '../../../shared/utils/app_log.dart';
import '../../auth/providers/user_provider.dart';
import '../controllers/conversation_controller.dart';
import '../states/chat_state.dart';

class ChatDetailController extends StateNotifier<ChatDetailState> {
  ChatDetailController(this._ref, this._conversationId)
    : super(const ChatDetailState()) {
    if (_conversationId != null) {
      state = state.copyWith(conversationId: _conversationId);
      _loadConversationDetails();
      fetchMessages();
      _subscribeToConversation();
      _startListeningToConversationUpdates();
    }
  }

  final Ref _ref;
  final String? _conversationId;
  void Function()? _unsubscribe;

  void _startListeningToConversationUpdates() {
    _ref.listen<ConversationState>(conversationControllerProvider, (
      ConversationState? previous,
      ConversationState next,
    ) {
      final ConversationEntity? updatedConversation = next.conversations
          .cast<ConversationEntity?>()
          .firstWhere(
            (ConversationEntity? c) => c?.id == _conversationId,
            orElse: () => null,
          );

      if (updatedConversation != null &&
          updatedConversation.blockStatus != state.blockStatus) {
        state = state.copyWith(blockStatus: updatedConversation.blockStatus);
      }
    });
  }

  Future<void> _loadConversationDetails() async {
    final List<ConversationEntity> conversations = _ref
        .read(conversationControllerProvider)
        .conversations;

    final ConversationEntity? conversation = conversations
        .cast<ConversationEntity?>()
        .firstWhere(
          (ConversationEntity? c) => c?.id == _conversationId,
          orElse: () => null,
        );

    if (conversation != null) {
      final String? currentUserId = _ref.read(currentUserProvider).value?.id;
      ParticipantEntity? otherUser;

      if (conversation.participants.isNotEmpty) {
        otherUser = conversation.participants
            .cast<ParticipantEntity>()
            .firstWhere(
              (ParticipantEntity p) => p.id != currentUserId,
              orElse: () => conversation.participants.first,
            );
      }

      state = state.copyWith(
        otherUser: otherUser,
        blockStatus: conversation.blockStatus,
      );
    }
  }

  @override
  void dispose() {
    _unsubscribe?.call();
    super.dispose();
  }

  Future<void> fetchMessages({bool loadMore = false}) async {
    if (state.status == ChatStatus.loading || (loadMore && !state.hasMore)) {
      return;
    }

    String? nextCursor;
    if (loadMore && state.messages.isNotEmpty) {
      nextCursor = state.messages.last.createdAt.toIso8601String();
    }

    state = state.copyWith(status: ChatStatus.loading);

    try {
      final ApiResponseObject<List<ChatMessageEntity>> response = await _ref
          .read(getMessagesUseCaseProvider)
          .call(conversationId: _conversationId ?? '', cursor: nextCursor);

      if (response.isSuccess && response.data != null) {
        final List<ChatMessageEntity> newMessages = response.data!;
        final List<ChatMessageEntity> updatedMessages = loadMore
            ? <ChatMessageEntity>[...state.messages, ...newMessages]
            : newMessages;

        state = state.copyWith(
          messages: _sortMessages(updatedMessages),
          status: ChatStatus.success,
          hasMore: newMessages.length >= 20,
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
        errorMessage: 'Failed to load messages: ${e.toString()}',
      );
    }
  }

  void _subscribeToConversation() {
    if (_conversationId == null) return;

    final SocketService socketService = _ref.read(socketServiceProvider);
    _unsubscribe = socketService.subscribe(
      '/topic/conversation/$_conversationId',
      (StompFrame frame) {
        if (frame.body != null) {
          try {
            final Map<String, dynamic> body =
                jsonDecode(frame.body!) as Map<String, dynamic>;
            final ChatMessageModel message = ChatMessageModel.fromJson(body);

            // Optimistic UI: Check if we have a temporary message that matches this new one
            final int tempIndex = state.messages.indexWhere(
              (ChatMessageEntity m) =>
                  m.id.startsWith('temp_') &&
                  m.content == message.content &&
                  m.sender.id == message.sender.id,
            );

            if (tempIndex != -1) {
              // Replace temporary message with real one
              final List<ChatMessageModel> updatedMessages =
                  List<ChatMessageModel>.from(state.messages);
              updatedMessages[tempIndex] = message;
              state = state.copyWith(messages: _sortMessages(updatedMessages));
              markAsRead();
            } else if (!state.messages.any(
              (ChatMessageEntity m) => m.id == message.id,
            )) {
              state = state.copyWith(
                messages: _sortMessages(<ChatMessageEntity>[
                  message,
                  ...state.messages,
                ]),
              );
              markAsRead();
            }
          } catch (e) {
            AppLog.error('Error parsing socket message', e);
          }
        }
      },
    );
  }

  Future<void> sendMessage(String content) async {
    if (_conversationId == null || content.trim().isEmpty) return;

    final AsyncValue<ProfileEntity?> currentUserState = _ref.read(
      currentUserProvider,
    );
    final ProfileEntity? userProfile = currentUserState.value;

    if (userProfile != null) {
      // Optimistic UI: Create temporary message
      final String tempId = 'temp_${DateTime.now().millisecondsSinceEpoch}';
      final ChatMessageModel tempMessage = ChatMessageModel(
        id: tempId,
        conversationId: _conversationId,
        participantModel: ParticipantModel(
          id: userProfile.id,
          username: userProfile.username,
          name:
              '${userProfile.firstName} ${userProfile.lastName}'.trim().isEmpty
              ? userProfile.username
              : '${userProfile.firstName} ${userProfile.lastName}',
          avatar: userProfile.avatar,
        ),
        content: content,
        createdDate: DateTime.now(),
        messageType: 'TEXT',
      );

      // Show immediately
      state = state.copyWith(
        messages: _sortMessages(<ChatMessageEntity>[
          tempMessage,
          ...state.messages,
        ]),
      );
    }

    final SocketService socketService = _ref.read(socketServiceProvider);

    socketService.send(
      '/app/chat.sendMessage',
      body: <String, dynamic>{
        'conversationId': _conversationId,
        'content': content,
        'type': 'TEXT',
      },
    );
  }

  Future<void> markAsRead() async {
    if (_conversationId == null) return;

    _ref
        .read(socketServiceProvider)
        .send(
          '/app/chat.markAsRead',
          body: <String, dynamic>{'conversationId': _conversationId},
        );

    await _ref.read(markChatAsReadUseCaseProvider).call(_conversationId);

    // Update local conversation list state
    _ref
        .read(conversationControllerProvider.notifier)
        .markConversationAsRead(_conversationId);
  }

  Future<void> toggleBlock(String username, String action) async {
    final ApiResponseStatus response = await _ref
        .read(toggleBlockUseCaseProvider)
        .call(username: username, action: action);

    if (response.isSuccess) {
      state = state.copyWith(
        blockStatus: action == 'BLOCK' ? 'BLOCKED' : 'NONE',
      );
    }
  }

  Future<bool> deleteConversation() async {
    if (_conversationId == null) return false;

    final ApiResponseStatus response = await _ref
        .read(deleteConversationUseCaseProvider)
        .call(_conversationId);

    return response.isSuccess;
  }

  List<ChatMessageEntity> _sortMessages(List<ChatMessageEntity> messages) {
    // Sort Newest First (Descending)
    final List<ChatMessageEntity> sorted = <ChatMessageEntity>[...messages];
    sorted.sort(
      (ChatMessageEntity a, ChatMessageEntity b) =>
          b.createdAt.compareTo(a.createdAt),
    );
    return sorted;
  }
}

final AutoDisposeStateNotifierProviderFamily<
  ChatDetailController,
  ChatDetailState,
  String?
>
chatDetailProvider = StateNotifierProvider.autoDispose
    .family<ChatDetailController, ChatDetailState, String?>(
      ChatDetailController.new,
    );
