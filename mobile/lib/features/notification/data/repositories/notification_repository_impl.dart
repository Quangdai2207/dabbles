import '../../../../core/network/api_response.dart';
import '../../domain/entities/notification_entity.dart';
import '../../domain/repositories/notification_repository.dart';
import '../datasources/remote/notification_remote_datasource.dart';
import '../models/notification_model.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  NotificationRepositoryImpl(this._remoteDataSource);
  final NotificationRemoteDataSource _remoteDataSource;

  @override
  Future<ApiResponseStatus> deleteNotification(String id) {
    return _remoteDataSource.deleteNotification(id);
  }

  @override
  Future<ApiResponseObject<List<NotificationEntity>>> getNotifications({
    int page = 0,
  }) async {
    final ApiResponseObject<List<NotificationModel>> response =
        await _remoteDataSource.getNotifications(page: page);
    if (response.isSuccess) {
      return ApiResponseObject<List<NotificationEntity>>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<List<NotificationEntity>>.error(
      response.errorMessage,
    );
  }

  @override
  Future<ApiResponseObject<int>> getTotalUnread() {
    return _remoteDataSource.getTotalUnread();
  }

  @override
  Future<ApiResponseStatus> markAllAsRead() {
    return _remoteDataSource.markAllAsRead();
  }

  @override
  Future<ApiResponseStatus> markAsRead(String id) {
    return _remoteDataSource.markAsRead(id);
  }
}
