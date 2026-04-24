import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/remote/contact_remote_datasource.dart';
import '../data/repositories/contact_repository_impl.dart';
import '../domain/repositories/contact_repository.dart';
import '../domain/usecases/contact_usecases.dart';

// Data Sources
final Provider<ContactRemoteDataSource> contactRemoteDataSourceProvider =
    Provider<ContactRemoteDataSource>((Ref ref) {
      return ContactRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repositories
final Provider<ContactRepository> contactRepositoryProvider =
    Provider<ContactRepository>((Ref ref) {
      return ContactRepositoryImpl(ref.watch(contactRemoteDataSourceProvider));
    });

// Use Cases
final Provider<GetFollowersUseCase> getFollowersUseCaseProvider =
    Provider<GetFollowersUseCase>((Ref ref) {
      return GetFollowersUseCase(ref.watch(contactRepositoryProvider));
    });

final Provider<GetFollowingsUseCase> getFollowingsUseCaseProvider =
    Provider<GetFollowingsUseCase>((Ref ref) {
      return GetFollowingsUseCase(ref.watch(contactRepositoryProvider));
    });

final Provider<GetPendingUseCase> getPendingUseCaseProvider =
    Provider<GetPendingUseCase>((Ref ref) {
      return GetPendingUseCase(ref.watch(contactRepositoryProvider));
    });

final Provider<GetBlockedUseCase> getBlockedUseCaseProvider =
    Provider<GetBlockedUseCase>((Ref ref) {
      return GetBlockedUseCase(ref.watch(contactRepositoryProvider));
    });

final Provider<HandleContactRequestUseCase>
handleContactRequestUseCaseProvider = Provider<HandleContactRequestUseCase>((
  Ref ref,
) {
  return HandleContactRequestUseCase(ref.watch(contactRepositoryProvider));
});

final Provider<HandleContactActionUseCase> handleContactActionUseCaseProvider =
    Provider<HandleContactActionUseCase>((Ref ref) {
      return HandleContactActionUseCase(ref.watch(contactRepositoryProvider));
    });

final Provider<RemoveFollowerUseCase> removeFollowerUseCaseProvider =
    Provider<RemoveFollowerUseCase>((Ref ref) {
      return RemoveFollowerUseCase(ref.watch(contactRepositoryProvider));
    });
