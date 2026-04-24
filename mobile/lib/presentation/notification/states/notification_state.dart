import '../../../features/notification/domain/entities/notification_entity.dart';

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
