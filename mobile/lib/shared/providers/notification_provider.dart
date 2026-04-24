import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_response.dart';
import '../../core/network/socket_service.dart';
import '../../features/auth/injection/auth_injection.dart';
import '../../features/notification/domain/entities/notification_entity.dart';
import '../../features/notification/injection/notification_injection.dart';
import '../../shared/constants/socket_constants.dart';
import '../../shared/utils/app_log.dart';

final StateProvider<int> notificationCountProvider = StateProvider<int>(
  (Ref ref) => 0,
);

class NotificationListState {
  const NotificationListState({
    this.notifications = const <NotificationEntity>[],
    this.isLoading = false,
    this.hasMore = true,
    this.page = 0,
  });

  final List<NotificationEntity> notifications;
  final bool isLoading;
  final bool hasMore;
  final int page;

  NotificationListState copyWith({
    List<NotificationEntity>? notifications,
    bool? isLoading,
    bool? hasMore,
    int? page,
  }) {
    return NotificationListState(
      notifications: notifications ?? this.notifications,
      isLoading: isLoading ?? this.isLoading,
      hasMore: hasMore ?? this.hasMore,
      page: page ?? this.page,
    );
  }
}

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
          // We can't modify the entity directly if it is const/immutable without copyWith
          // Assuming Entity has no copyWith, we might need to recreate it or ignoring for now if we just want to trigger API
          // But UI needs to update. Let's rely on fetch or manual update if Entity has copyWith.
          // Entity in previous view didn't show copyWith.
          // Let's check Entity again or just call API and refresh.
          // Client refreshes. Mobile should probably update state locally for speed.
          // Let's assume we just call API for now and maybe refresh.
          return e;
        }
        return e;
      }).toList(),
    );

    final ApiResponseStatus result = await ref
        .read(markAsReadUseCaseProvider)
        .call(id);

    if (result.isSuccess) {
      // Ideally update local state here to set read = true
      // Verify if Entity has copyWith. If not, just fetchNotifications(refresh: true)
      // but that might be heavy.
      // Let's fetch for correctness for now.
      await fetchNotifications(refresh: true);

      // Update global count
      // ref.refresh(getTotalUnreadUseCaseProvider); // Unused

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

final StateNotifierProvider<NotificationListNotifier, NotificationListState>
notificationListProvider =
    StateNotifierProvider<NotificationListNotifier, NotificationListState>((
      Ref ref,
    ) {
      return NotificationListNotifier(ref);
    });

// Token provider
final FutureProvider<String?> authTokenProvider = FutureProvider<String?>((
  Ref ref,
) {
  return ref.watch(authRepositoryProvider).getToken();
});

// Socket integration provider
final Provider<void> notificationSocketProvider = Provider<void>((Ref ref) {
  final SocketService socketService = SocketService();
  final AsyncValue<String?> tokenAsync = ref.watch(authTokenProvider);

  tokenAsync.whenData((String? token) {
    if (token != null) {
      socketService.connect(
        token: token,
        onConnect: (_) {
          // Subscribe to notifications
          socketService.subscribe(SocketConstants.notificationQueue, (
            dynamic frame,
          ) {
            // ignore: avoid_dynamic_calls
            if (frame.body != null) {
              try {
                // ignore: avoid_dynamic_calls
                final dynamic data = jsonDecode(frame.body as String);
                // Client shape: { notification: {...} }
                if (data is Map<String, dynamic>) {
                  final Map<String, dynamic> mapData = data;
                  if (mapData['notification'] != null) {
                    // Triggering refresh for simple & safe implementation
                    ref
                        .read(notificationListProvider.notifier)
                        .fetchNotifications(refresh: true);

                    // Update count
                    ref.read(notificationCountProvider.notifier).state++;
                  }
                }
              } catch (e) {
                AppLog.error('Error parsing notification', e);
              }
            }
          });

          // Subscribe to chat updates/badging
          socketService.subscribe(SocketConstants.chatUpdatesQueue, (
            dynamic frame,
          ) {
            // Handle chat badge if needed
          });
        },
      );
    }
  });
});
