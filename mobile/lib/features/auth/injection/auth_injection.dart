import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/services/google_sign_in_service.dart';
import '../data/datasources/local/auth_local_datasource.dart';
import '../data/datasources/remote/auth_remote_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import '../domain/repositories/auth_repository.dart';
import '../domain/usecases/auth_usecase.dart';

// ==================== Shared Services ====================

final Provider<GoogleSignInService> googleSignInServiceProvider =
    Provider<GoogleSignInService>((Ref ref) => GoogleSignInService());

// ==================== Auth Datasources ====================

final Provider<AuthRemoteDatasource> authRemoteDatasourceProvider =
    Provider<AuthRemoteDatasource>(
      (Ref ref) => AuthRemoteDatasource(ref.read(apiClientProvider)),
    );

final Provider<AuthLocalDatasource> authLocalDatasourceProvider =
    Provider<AuthLocalDatasource>(
      (Ref ref) => AuthLocalDatasourceImpl(
        storageService: ref.read(storageServiceProvider),
      ),
    );

// ==================== Auth Repository ====================

final Provider<AuthRepository> authRepositoryProvider =
    Provider<AuthRepository>(
      (Ref ref) => AuthRepositoryImpl(
        ref.read(authRemoteDatasourceProvider),
        ref.read(authLocalDatasourceProvider),
      ),
    );

// ==================== Auth UseCases ====================

final Provider<LoginUseCase> loginUseCaseProvider = Provider<LoginUseCase>(
  (Ref ref) => LoginUseCase(ref.read(authRepositoryProvider)),
);

final Provider<LoginWithGoogleUseCase> loginWithGoogleUseCaseProvider =
    Provider<LoginWithGoogleUseCase>(
      (Ref ref) => LoginWithGoogleUseCase(ref.read(authRepositoryProvider)),
    );

final Provider<RegisterUseCase> registerUseCaseProvider =
    Provider<RegisterUseCase>(
      (Ref ref) => RegisterUseCase(ref.read(authRepositoryProvider)),
    );

final Provider<LogoutUseCase> logoutUseCaseProvider = Provider<LogoutUseCase>(
  (Ref ref) => LogoutUseCase(ref.read(authRepositoryProvider)),
);

final Provider<GetProfileUseCase> getProfileUseCaseProvider =
    Provider<GetProfileUseCase>(
      (Ref ref) => GetProfileUseCase(ref.read(authRepositoryProvider)),
    );

final Provider<UpdateProfileUseCase> updateProfileUseCaseProvider =
    Provider<UpdateProfileUseCase>(
      (Ref ref) => UpdateProfileUseCase(ref.read(authRepositoryProvider)),
    );

final Provider<ForgotPasswordUseCase> forgotPasswordUseCaseProvider =
    Provider<ForgotPasswordUseCase>(
      (Ref ref) => ForgotPasswordUseCase(ref.read(authRepositoryProvider)),
    );

final Provider<ResetPasswordUseCase> resetPasswordUseCaseProvider =
    Provider<ResetPasswordUseCase>(
      (Ref ref) => ResetPasswordUseCase(ref.read(authRepositoryProvider)),
    );

// ==================== Auth State Provider ====================

class AuthStateNotifier extends AsyncNotifier<bool> {
  @override
  Future<bool> build() async {
    return ref.watch(authRepositoryProvider).isLoggedIn();
  }

  void authenticate() {
    state = const AsyncData<bool>(true);
  }

  void unauthenticate() {
    state = const AsyncData<bool>(false);
  }
}

final AsyncNotifierProvider<AuthStateNotifier, bool> authStateProvider =
    AsyncNotifierProvider<AuthStateNotifier, bool>(AuthStateNotifier.new);
final FutureProvider<String?> authAccountIdProvider = FutureProvider<String?>(
  (Ref ref) => ref.watch(authRepositoryProvider).getAccountId(),
);
