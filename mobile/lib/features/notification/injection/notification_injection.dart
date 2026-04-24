import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/remote/notification_remote_datasource.dart';
import '../data/repositories/notification_repository_impl.dart';
import '../domain/repositories/notification_repository.dart';
import '../domain/usecases/notification_usecases.dart';

// Data Sources
final Provider<NotificationRemoteDataSource>
notificationRemoteDataSourceProvider = Provider<NotificationRemoteDataSource>((
  Ref ref,
) {
  return NotificationRemoteDataSource(ref.watch(apiClientProvider));
});

// Repositories
final Provider<NotificationRepository> notificationRepositoryProvider =
    Provider<NotificationRepository>((Ref ref) {
      return NotificationRepositoryImpl(
        ref.watch(notificationRemoteDataSourceProvider),
      );
    });

// Use Cases
final Provider<GetTotalUnreadUseCase> getTotalUnreadUseCaseProvider =
    Provider<GetTotalUnreadUseCase>((Ref ref) {
      return GetTotalUnreadUseCase(ref.watch(notificationRepositoryProvider));
    });

final Provider<GetNotificationsUseCase> getNotificationsUseCaseProvider =
    Provider<GetNotificationsUseCase>((Ref ref) {
      return GetNotificationsUseCase(ref.watch(notificationRepositoryProvider));
    });

final Provider<MarkAllAsReadUseCase> markAllAsReadUseCaseProvider =
    Provider<MarkAllAsReadUseCase>((Ref ref) {
      return MarkAllAsReadUseCase(ref.watch(notificationRepositoryProvider));
    });

final Provider<MarkAsReadUseCase> markAsReadUseCaseProvider =
    Provider<MarkAsReadUseCase>((Ref ref) {
      return MarkAsReadUseCase(ref.watch(notificationRepositoryProvider));
    });

final Provider<DeleteNotificationUseCase> deleteNotificationUseCaseProvider =
    Provider<DeleteNotificationUseCase>((Ref ref) {
      return DeleteNotificationUseCase(
        ref.watch(notificationRepositoryProvider),
      );
    });
