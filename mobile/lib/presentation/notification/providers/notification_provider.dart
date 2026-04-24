import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/socket_service.dart';
import '../../../features/auth/injection/auth_injection.dart';
import '../../../presentation/messenger/controllers/conversation_controller.dart';
import '../../../shared/constants/socket_constants.dart';
import '../../../shared/utils/app_log.dart';
import '../controllers/notification_controller.dart';
import '../states/notification_state.dart';

export '../controllers/notification_controller.dart';

final StateProvider<int> notificationCountProvider = StateProvider<int>(
  (Ref ref) => 0,
);

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
            // ignore: avoid_dynamic_calls
            if (frame.body != null) {
              try {
                // ignore: avoid_dynamic_calls
                final dynamic data = jsonDecode(frame.body as String);
                if (data is Map<String, dynamic>) {
                  // Forward to ConversationController
                  ref
                      .read(conversationControllerProvider.notifier)
                      .handleSocketMessage(data);
                }
              } catch (e) {
                AppLog.error('Error parsing chat update', e);
              }
            }
          });
        },
      );
    }
  });
});
