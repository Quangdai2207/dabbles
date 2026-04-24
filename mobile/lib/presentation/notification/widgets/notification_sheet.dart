import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../../features/notification/domain/entities/notification_entity.dart';
import '../../../../presentation/notification/providers/notification_provider.dart';
import '../states/notification_state.dart';
import 'notification_tile.dart';

class NotificationSheet extends ConsumerStatefulWidget {
  const NotificationSheet({super.key});

  @override
  ConsumerState<NotificationSheet> createState() => _NotificationSheetState();
}

class _NotificationSheetState extends ConsumerState<NotificationSheet> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(notificationListProvider.notifier).fetchNotifications();
    }
  }

  @override
  Widget build(BuildContext context) {
    final NotificationListState state = ref.watch(notificationListProvider);
    final List<NotificationEntity> notifications = state.notifications;

    return SizedBox(
      height: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(
                  'Notifications',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                // Mark all as read button
                IconButton(
                  tooltip: 'Mark all as read',
                  icon: const Icon(LucideIcons.checkCheck),
                  onPressed: () {
                    ref.read(notificationListProvider.notifier).markAllAsRead();
                  },
                ),
                IconButton(
                  icon: const Icon(LucideIcons.x),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: notifications.isEmpty && state.isLoading
                ? const Center(child: CircularProgressIndicator())
                : notifications.isEmpty
                ? const Center(child: Text('No notifications'))
                : RefreshIndicator(
                    onRefresh: () async {
                      await ref
                          .read(notificationListProvider.notifier)
                          .fetchNotifications(refresh: true);
                    },
                    child: ListView.separated(
                      controller: _scrollController,
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: EdgeInsets.zero, // Padding handled in tile
                      itemCount:
                          notifications.length + (state.isLoading ? 1 : 0),
                      separatorBuilder: (_, _) => const Divider(height: 1),
                      itemBuilder: (BuildContext context, int index) {
                        if (index == notifications.length) {
                          return const Center(
                            child: Padding(
                              padding: EdgeInsets.all(8.0),
                              child: CircularProgressIndicator(),
                            ),
                          );
                        }
                        final NotificationEntity notification =
                            notifications[index];
                        return NotificationTile(notification: notification);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
