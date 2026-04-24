import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../features/chat/domain/entities/chat_entity.dart';
import '../../../shared/widgets/user_avatar.dart';
import '../controllers/conversation_controller.dart';
import '../states/chat_state.dart';
import '../widgets/time_ago_text.dart';
import 'chat_detail_screen.dart';

class MessengerScreen extends ConsumerStatefulWidget {
  const MessengerScreen({super.key});

  @override
  ConsumerState<MessengerScreen> createState() => _MessengerScreenState();
}

class _MessengerScreenState extends ConsumerState<MessengerScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(conversationControllerProvider.notifier).init();
    });
  }

  @override
  Widget build(BuildContext context) {
    final ConversationState state = ref.watch(conversationControllerProvider);
    // final ThemeData theme = Theme.of(context);

    return Column(
      children: <Widget>[
        // Search bar temporarily hidden
        // Padding(
        //   padding: const EdgeInsets.all(16.0),
        //   child: Row(
        //     children: <Widget>[
        //       Expanded(
        //         child: TextField(
        //           decoration: InputDecoration(
        //             hintText: 'Search messages...',
        //             prefixIcon: const Icon(LucideIcons.search, size: 20),
        //             border: OutlineInputBorder(
        //               borderRadius: BorderRadius.circular(12),
        //               borderSide: BorderSide.none,
        //             ),
        //             filled: true,
        //             fillColor: theme.colorScheme.surfaceContainerHighest
        //                 .withValues(alpha: 0.5),
        //             contentPadding: const EdgeInsets.symmetric(
        //               horizontal: 16,
        //               vertical: 12,
        //             ),
        //           ),
        //         ),
        //       ),
        //       const SizedBox(width: 8),
        //       IconButton(
        //         onPressed: () {
        //           // TODO: Implement new conversation
        //         },
        //         icon: const Icon(LucideIcons.squarePen),
        //       ),
        //     ],
        //   ),
        // ),
        Expanded(child: _buildContent(state)),
      ],
    );
  }

  Widget _buildContent(ConversationState state) {
    if (state.status == ChatStatus.loading && state.conversations.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.status == ChatStatus.error && state.conversations.isEmpty) {
      if (state.isNotFound) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Icon(LucideIcons.searchX, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                'Conversations Not Found',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              const Text('We couldn\'t find any conversations for you.'),
            ],
          ),
        );
      }
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Icon(LucideIcons.circleAlert, size: 48, color: Colors.grey),
            const SizedBox(height: 16),
            Text('Error: ${state.errorMessage}'),
            TextButton(
              onPressed: () => ref
                  .read(conversationControllerProvider.notifier)
                  .fetchConversations(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (state.conversations.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(LucideIcons.messageSquareMore, size: 48, color: Colors.grey),
            SizedBox(height: 16),
            Text('No conversations yet'),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref
          .read(conversationControllerProvider.notifier)
          .fetchConversations(),
      child: ListView.builder(
        itemCount: state.conversations.length,
        itemBuilder: (BuildContext context, int index) {
          final ConversationEntity conversation = state.conversations[index];
          return _buildChatItem(context, conversation);
        },
      ),
    );
  }

  Widget _buildChatItem(BuildContext context, ConversationEntity conversation) {
    final AsyncValue<ProfileEntity?> authProfileAsync = ref.watch(
      currentUserProvider,
    );
    final String? currentUsername = authProfileAsync.value?.username;

    // For private chats, identify the other participant
    ParticipantEntity? otherParticipant;
    if (!conversation.isGroup && conversation.participants.isNotEmpty) {
      otherParticipant = conversation.participants
          .cast<ParticipantEntity?>()
          .firstWhere(
            (ParticipantEntity? p) => p?.username != currentUsername,
            orElse: () => conversation.participants.first,
          );
    }

    final String title =
        conversation.name ??
        otherParticipant?.name ??
        (conversation.participants.isNotEmpty
            ? conversation.participants.first.name
            : 'Unknown');

    final String? avatar =
        conversation.avatar ??
        otherParticipant?.avatar ??
        (conversation.participants.isNotEmpty
            ? conversation.participants.first.avatar
            : null);

    final bool hasUnread = conversation.unreadMessageCount > 0;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        vertical: 4.0,
        horizontal: 16.0,
      ),
      leading: UserAvatar(avatarUrl: avatar, name: title, radius: 28),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: hasUnread ? FontWeight.bold : FontWeight.w600,
          fontSize: 16,
        ),
      ),
      subtitle: Text(
        conversation.lastMessage ?? 'No messages yet',
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          color: hasUnread ? Colors.black : Colors.grey,
          fontWeight: hasUnread ? FontWeight.w500 : FontWeight.normal,
        ),
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          if (conversation.lastMessageAt != null)
            TimeAgoText(
              date: conversation.lastMessageAt!,
              style: TextStyle(
                fontSize: 12,
                color: hasUnread
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).hintColor,
              ),
            ),
          if (hasUnread)
            Container(
              margin: const EdgeInsets.only(top: 6),
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (BuildContext context) =>
                ChatDetailScreen(conversationId: conversation.id, title: title),
          ),
        );
      },
    );
  }
}
