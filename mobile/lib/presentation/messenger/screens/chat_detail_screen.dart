import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../features/chat/domain/entities/chat_entity.dart';
import '../../../shared/widgets/user_avatar.dart';
import '../../auth/providers/user_provider.dart';
import '../controllers/chat_detail_controller.dart';
import '../states/chat_state.dart';
import '../widgets/date_header.dart';
import '../widgets/message_bubble.dart';

class ChatDetailScreen extends ConsumerStatefulWidget {
  const ChatDetailScreen({
    super.key,
    required this.conversationId,
    required this.title,
  });

  final String conversationId;
  final String title;

  @override
  ConsumerState<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends ConsumerState<ChatDetailScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _focusNode = FocusNode();

  final Set<String> _showTimestampIds = <String>{};

  void _toggleTimestamp(String id) {
    setState(() {
      if (_showTimestampIds.contains(id)) {
        _showTimestampIds.remove(id);
      } else {
        _showTimestampIds.add(id);
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(chatDetailProvider(widget.conversationId).notifier).markAsRead();
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      ref
          .read(chatDetailProvider(widget.conversationId).notifier)
          .fetchMessages(loadMore: true);
    }
  }

  void _handleSendMessage() {
    final String text = _messageController.text.trim();
    if (text.isNotEmpty) {
      ref
          .read(chatDetailProvider(widget.conversationId).notifier)
          .sendMessage(text);
      _messageController.clear();
      _focusNode.requestFocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final ChatDetailState state = ref.watch(
      chatDetailProvider(widget.conversationId),
    );
    final ProfileEntity? currentUser = ref.watch(currentUserProvider).value;
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
        titleSpacing: 0,
        title: Row(
          children: <Widget>[
            if (state.otherUser != null) ...<Widget>[
              UserAvatar(
                avatarUrl: state.otherUser!.avatar,
                name: state.otherUser!.name,
                radius: 18,
                fontSize: 14,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      state.otherUser!.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Text(
                      'Active now',
                      style: TextStyle(fontSize: 12, color: Colors.green),
                    ),
                  ],
                ),
              ),
            ] else
              Text(widget.title),
          ],
        ),
        actions: <Widget>[
          PopupMenuButton<String>(
            onSelected: (String value) {
              if (value == 'block') {
                _handleBlockUser(state.otherUser?.username);
              } else if (value == 'delete') {
                _handleDeleteMessages();
              }
            },
            itemBuilder: (BuildContext context) {
              return <PopupMenuEntry<String>>[
                if (state.blockStatus == 'NONE')
                  const PopupMenuItem<String>(
                    value: 'block',
                    child: Row(
                      children: <Widget>[
                        Icon(LucideIcons.ban, color: Colors.red, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Block this user',
                          style: TextStyle(color: Colors.red),
                        ),
                      ],
                    ),
                  ),
                const PopupMenuItem<String>(
                  value: 'delete',
                  child: Row(
                    children: <Widget>[
                      Icon(LucideIcons.trash2, size: 20),
                      SizedBox(width: 8),
                      Text('Delete messages'),
                    ],
                  ),
                ),
              ];
            },
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Expanded(child: _buildMessageList(state, currentUser?.id)),
          _buildInputArea(theme, state),
        ],
      ),
    );
  }

  Future<void> _handleBlockUser(String? username) async {
    if (username == null) return;
    await ref
        .read(chatDetailProvider(widget.conversationId).notifier)
        .toggleBlock(username, 'BLOCK');
  }

  Future<void> _handleUnblockUser(String? username) async {
    if (username == null) return;
    await ref
        .read(chatDetailProvider(widget.conversationId).notifier)
        .toggleBlock(username, 'UNBLOCK');
  }

  Future<void> _handleDeleteMessages() async {
    final bool result = await ref
        .read(chatDetailProvider(widget.conversationId).notifier)
        .deleteConversation();

    if (result && mounted) {
      Navigator.of(context).pop(); // Exit chat screen
    }
  }

  Widget _buildMessageList(ChatDetailState state, String? currentUserId) {
    if (state.status == ChatStatus.loading && state.messages.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.status == ChatStatus.error && state.messages.isEmpty) {
      if (state.isNotFound) {
        return const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(LucideIcons.searchX, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                'Conversation Not Found',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('This conversation may have been deleted.'),
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
          ],
        ),
      );
    }

    if (state.messages.isEmpty) {
      return const Center(child: Text('No messages yet. Send a greeting!'));
    }

    return ListView.builder(
      controller: _scrollController,
      reverse: true,
      padding: const EdgeInsets.all(16),
      itemCount: state.messages.length + (state.hasMore ? 1 : 0),
      itemBuilder: (BuildContext context, int index) {
        if (index == state.messages.length) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(),
            ),
          );
        }

        final ChatMessageEntity message = state.messages[index];
        final ChatMessageEntity? nextMessage = index + 1 < state.messages.length
            ? state.messages[index + 1]
            : null;
        final ChatMessageEntity? prevMessage = index - 1 >= 0
            ? state.messages[index - 1]
            : null;

        final bool isMe = message.sender.id == currentUserId;

        // Date Header Logic (Compare with older message i.e. nextMessage)
        bool showDateHeader = false;
        if (nextMessage == null) {
          showDateHeader = true; // First message ever (at bottom of data)
        } else {
          final DateTime currentDate = DateTime(
            message.createdAt.year,
            message.createdAt.month,
            message.createdAt.day,
          );
          final DateTime nextDate = DateTime(
            nextMessage.createdAt.year,
            nextMessage.createdAt.month,
            nextMessage.createdAt.day,
          );
          if (currentDate.difference(nextDate).inDays != 0) {
            showDateHeader = true;
          }
        }

        // Avatar Logic (Show if last in block i.e. newest in consecutive group)
        // In reverse list: 'prevMessage' is the NEWER message.
        // If prevMessage is null OR sender is different, then THIS is the last (newest) of the block.
        final bool showAvatar =
            !isMe &&
            (prevMessage == null || prevMessage.sender.id != message.sender.id);

        return Column(
          children: <Widget>[
            if (showDateHeader) DateHeader(date: message.createdAt),
            _buildMessageBubble(message, isMe, showAvatar),
          ],
        );
      },
    );
  }

  Widget _buildMessageBubble(
    ChatMessageEntity message,
    bool isMe,
    bool showAvatar,
  ) {
    return MessageBubble(
      message: message,
      isCurrentUser: isMe,
      showAvatar: showAvatar,
      showTimestamp: _showTimestampIds.contains(message.id),
      onTap: () => _toggleTimestamp(message.id),
    );
  }

  Widget _buildInputArea(ThemeData theme, ChatDetailState state) {
    if (state.blockStatus != 'NONE') {
      final bool isBlockedByMe = state.blockStatus == 'BLOCKED';
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
          border: Border(top: BorderSide(color: Colors.grey.shade200)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                isBlockedByMe
                    ? 'You have blocked this user.'
                    : 'You have been blocked by this user.',
                style: const TextStyle(color: Colors.grey),
              ),
              if (isBlockedByMe) ...<Widget>[
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(LucideIcons.shieldCheck, size: 16),
                    label: const Text('Unblock'),
                    onPressed: () =>
                        _handleUnblockUser(state.otherUser?.username),
                  ),
                ),
              ],
            ],
          ),
        ),
      );
    }

    if (state.blockStatus == 'BLOCKED') {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
          border: Border(top: BorderSide(color: theme.dividerColor)),
        ),
        child: SafeArea(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest.withValues(
                alpha: 0.5,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text(
                  'You have blocked this user.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: () =>
                      _handleUnblockUser(state.otherUser?.username),
                  icon: const Icon(LucideIcons.lockOpen, size: 16),
                  label: const Text('Unblock'),
                  style: OutlinedButton.styleFrom(
                    visualDensity: VisualDensity.compact,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (state.blockStatus == 'BLOCKED_BY') {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
          border: Border(top: BorderSide(color: theme.dividerColor)),
        ),
        child: SafeArea(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainerHighest.withValues(
                alpha: 0.5,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Center(
              child: Text(
                'You have been blocked by this user.',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        ),
      );
    }

    if (state.isNotFound) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, -1),
            blurRadius: 5,
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <Widget>[
            IconButton(
              icon: Icon(LucideIcons.plus, color: theme.primaryColor),
              onPressed: () {
                // TODO: Attachment support
              },
            ),
            Expanded(
              child: TextField(
                controller: _messageController,
                focusNode: _focusNode,
                keyboardType: TextInputType.multiline,
                maxLines: 5,
                minLines: 1,
                textCapitalization: TextCapitalization.sentences,
                decoration: InputDecoration(
                  hintText: 'Type a message...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: theme.colorScheme.surfaceContainerHighest
                      .withValues(alpha: 0.5),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                ),
              ),
            ),
            IconButton(
              icon: Icon(LucideIcons.sendHorizontal, color: theme.primaryColor),
              onPressed: _handleSendMessage,
            ),
          ],
        ),
      ),
    );
  }
}
