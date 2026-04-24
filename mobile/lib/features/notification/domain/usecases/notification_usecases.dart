import '../../../../core/network/api_response.dart';
import '../entities/notification_entity.dart';
import '../repositories/notification_repository.dart';

class GetTotalUnreadUseCase {
  GetTotalUnreadUseCase(this._repository);
  final NotificationRepository _repository;

  Future<ApiResponseObject<int>> call() {
    return _repository.getTotalUnread();
  }
}

class GetNotificationsUseCase {
  GetNotificationsUseCase(this._repository);
  final NotificationRepository _repository;

  Future<ApiResponseObject<List<NotificationEntity>>> call({int page = 0}) {
    return _repository.getNotifications(page: page);
  }
}

class MarkAllAsReadUseCase {
  MarkAllAsReadUseCase(this._repository);
  final NotificationRepository _repository;

  Future<ApiResponseStatus> call() {
    return _repository.markAllAsRead();
  }
}

class MarkAsReadUseCase {
  MarkAsReadUseCase(this._repository);
  final NotificationRepository _repository;

  Future<ApiResponseStatus> call(String id) {
    return _repository.markAsRead(id);
  }
}

class DeleteNotificationUseCase {
  DeleteNotificationUseCase(this._repository);
  final NotificationRepository _repository;

  Future<ApiResponseStatus> call(String id) {
    return _repository.deleteNotification(id);
  }
}
