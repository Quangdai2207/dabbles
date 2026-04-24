import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/chat/domain/entities/chat_entity.dart';
import 'package:dabble/features/chat/injection/chat_injection.dart';
import 'package:dabble/presentation/messenger/controllers/conversation_controller.dart';
import 'package:dabble/presentation/messenger/screens/chat_detail_screen.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Message button for user profiles.
class MessageButton extends ConsumerStatefulWidget {
  const MessageButton({super.key, required this.username});

  final String username;

  @override
  ConsumerState<MessageButton> createState() => _MessageButtonState();
}

class _MessageButtonState extends ConsumerState<MessageButton> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return OutlinedButton(
      onPressed: _isLoading ? null : () => _handleMessage(context),
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: theme.colorScheme.outline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: _isLoading
          ? const SizedBox(
              height: 16,
              width: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : const Text(
              'Message',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
    );
  }

  Future<void> _handleMessage(BuildContext context) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // 1. Check local state first (like web client using conversationMap)
      final List<ConversationEntity> conversations = ref
          .read(conversationControllerProvider)
          .conversations;

      final ConversationEntity? existingInState = conversations
          .cast<ConversationEntity?>()
          .firstWhere(
            (ConversationEntity? c) =>
                c?.isGroup == false &&
                c?.participants.any(
                      (ParticipantEntity p) => p.username == widget.username,
                    ) ==
                    true,
            orElse: () => null,
          );

      if (existingInState != null) {
        _navigateToChat(context, existingInState);
        return;
      }

      ConversationEntity? conversationResult;

      // 2. Not in local state, try finding via API
      try {
        final ApiResponseObject<ConversationEntity> findResponse = await ref
            .read(findConversationUseCaseProvider)
            .call(widget.username);

        if (findResponse.isSuccess && findResponse.data != null) {
          conversationResult = findResponse.data;
        }
      } catch (e) {
        // Ignore "not found" (400/404) errors to allow fallback to create
        // Other errors will be caught by the outer try-catch
        debugPrint('Find conversation error (expected if new): $e');
      }

      if (conversationResult != null) {
        if (context.mounted) {
          // Add to controller to ensure ChatDetailScreen finds it
          ref
              .read(conversationControllerProvider.notifier)
              .updateConversation(conversationResult);
          _navigateToChat(context, conversationResult);
        }
        return;
      }

      // 3. If not found, create a new one
      final ApiResponseObject<ConversationEntity> createResponse = await ref
          .read(createConversationUseCaseProvider)
          .call(usernames: <String>[widget.username]);

      if (createResponse.isSuccess && createResponse.data != null) {
        if (context.mounted) {
          // Add to controller to ensure ChatDetailScreen finds it
          ref
              .read(conversationControllerProvider.notifier)
              .updateConversation(createResponse.data!);
          _navigateToChat(context, createResponse.data!);
        }
      } else {
        if (context.mounted) {
          ToastUtils.showError(
            context,
            title: createResponse.errorMessage.isNotEmpty
                ? createResponse.errorMessage
                : 'Failed to create conversation',
          );
        }
      }
    } catch (e) {
      debugPrint('Error in MessageButton: $e');
      if (context.mounted) {
        ToastUtils.showError(context, title: 'An error occurred');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _navigateToChat(BuildContext context, ConversationEntity conversation) {
    if (!context.mounted) return;

    final String title =
        conversation.name ??
        (conversation.participants.isNotEmpty
            ? conversation.participants.first.name
            : 'Unknown');

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (BuildContext context) =>
            ChatDetailScreen(conversationId: conversation.id, title: title),
      ),
    );
  }
}
