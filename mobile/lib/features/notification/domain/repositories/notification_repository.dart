import '../../../../core/network/api_response.dart';
import '../entities/notification_entity.dart';

abstract class NotificationRepository {
  Future<ApiResponseObject<int>> getTotalUnread();

  Future<ApiResponseObject<List<NotificationEntity>>> getNotifications({
    int page = 0,
  });

  Future<ApiResponseStatus> markAllAsRead();

  Future<ApiResponseStatus> markAsRead(String id);

  Future<ApiResponseStatus> deleteNotification(String id);
}
