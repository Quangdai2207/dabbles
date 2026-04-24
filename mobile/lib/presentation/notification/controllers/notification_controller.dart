import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_response.dart';
import '../../../features/notification/domain/entities/notification_entity.dart';
import '../../../features/notification/injection/notification_injection.dart';
import '../providers/notification_provider.dart';

import '../states/notification_state.dart';

class NotificationListNotifier extends StateNotifier<NotificationListState> {
  NotificationListNotifier(this.ref) : super(const NotificationListState());

  final Ref ref;

  Future<void> fetchNotifications({bool refresh = false}) async {
    if (state.isLoading) return;
    if (!refresh && !state.hasMore) return;

    final int page = refresh ? 0 : state.page;
    state = state.copyWith(isLoading: true);

    final ApiResponseObject<List<NotificationEntity>> result = await ref
        .read(getNotificationsUseCaseProvider)
        .call(page: page);

    if (result.isSuccess) {
      final List<NotificationEntity> newItems =
          result.data ?? <NotificationEntity>[];
      // Assuming paginated response logic or just simplistic hasMore logic
      final bool hasMore = newItems.isNotEmpty;

      state = state.copyWith(
        notifications: refresh
            ? newItems
            : <NotificationEntity>[...state.notifications, ...newItems],
        isLoading: false,
        hasMore: hasMore,
        page: page + 1,
      );
    } else {
      state = state.copyWith(isLoading: false);
    }
  }

  void addNotification(NotificationEntity notification) {
    state = state.copyWith(
      notifications: <NotificationEntity>[notification, ...state.notifications],
    );
  }

  Future<void> markAsRead(String id) async {
    // Optimistic update
    state = state.copyWith(
      notifications: state.notifications.map((NotificationEntity e) {
        if (e.id == id) {
          return e;
        }
        return e;
      }).toList(),
    );

    final ApiResponseStatus result = await ref
        .read(markAsReadUseCaseProvider)
        .call(id);

    if (result.isSuccess) {
      await fetchNotifications(refresh: true);

      final ApiResponseObject<int> countRes = await ref
          .read(getTotalUnreadUseCaseProvider)
          .call();
      if (countRes.isSuccess && countRes.data != null) {
        ref.read(notificationCountProvider.notifier).state = countRes.data!;
      }
    }
  }

  Future<void> deleteNotification(String id) async {
    // Optimistic removal
    final List<NotificationEntity> original = state.notifications;
    state = state.copyWith(
      notifications: state.notifications
          .where((NotificationEntity e) => e.id != id)
          .toList(),
    );

    final ApiResponseStatus result = await ref
        .read(deleteNotificationUseCaseProvider)
        .call(id);

    if (!result.isSuccess) {
      // Revert if failed
      state = state.copyWith(notifications: original);
    }
  }

  Future<void> markAllAsRead() async {
    final ApiResponseStatus result = await ref
        .read(markAllAsReadUseCaseProvider)
        .call();

    if (result.isSuccess) {
      await fetchNotifications(refresh: true); // Added await
      ref.read(notificationCountProvider.notifier).state = 0;
    }
  }
}
