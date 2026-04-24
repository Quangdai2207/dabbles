import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/datasources/remote/user_remote_datasource.dart';
import '../data/repositories/user_repository_impl.dart';
import '../domain/repositories/user_repository.dart';
import '../domain/usecases/user_usecases.dart';

// Data Source
final Provider<UserRemoteDataSource> userRemoteDataSourceProvider =
    Provider<UserRemoteDataSource>((Ref ref) {
      return UserRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repository
final Provider<UserRepository> userRepositoryProvider =
    Provider<UserRepository>((Ref ref) {
      return UserRepositoryImpl(ref.watch(userRemoteDataSourceProvider));
    });

// Use Cases
final Provider<GetUserProfileUseCase> getUserProfileUseCaseProvider =
    Provider<GetUserProfileUseCase>((Ref ref) {
      return GetUserProfileUseCase(ref.watch(userRepositoryProvider));
    });

final Provider<SearchUsersUseCase> searchUsersUseCaseProvider =
    Provider<SearchUsersUseCase>((Ref ref) {
      return SearchUsersUseCase(ref.watch(userRepositoryProvider));
    });

final Provider<UpdateProfileUseCase> updateUserProfileUseCaseProvider =
    Provider<UpdateProfileUseCase>((Ref ref) {
      return UpdateProfileUseCase(ref.watch(userRepositoryProvider));
    });

final Provider<ChangePasswordUseCase> changePasswordUseCaseProvider =
    Provider<ChangePasswordUseCase>((Ref ref) {
      return ChangePasswordUseCase(ref.watch(userRepositoryProvider));
    });

final Provider<TogglePrivacyUseCase> togglePrivacyUseCaseProvider =
    Provider<TogglePrivacyUseCase>((Ref ref) {
      return TogglePrivacyUseCase(ref.watch(userRepositoryProvider));
    });
