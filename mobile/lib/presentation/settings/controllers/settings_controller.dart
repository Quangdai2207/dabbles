import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:dabble/features/user/injection/user_injection.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:dabble/presentation/search/providers/search_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/utils/session_utils.dart';

class SettingsController extends StateNotifier<AsyncValue<void>> {
  SettingsController(this._ref) : super(const AsyncData<void>(null));
  final Ref _ref;

  Future<void> logout() async {
    state = const AsyncLoading<void>();
    try {
      final ApiResponseStatus result = await _ref
          .read(logoutUseCaseProvider)
          .call();

      if (result.isSuccess) {
        // Authenticate state update
        _ref.read(authStateProvider.notifier).unauthenticate();

        // Invalidate all user data providers to ensure clean state
        SessionUtils.invalidateUserSession(_ref);

        // Search
        _ref.invalidate(searchProvider);

        state = const AsyncData<void>(null);
      } else {
        // Handle error status if needed, potentially with a message
        state = AsyncError<void>('Logout failed', StackTrace.current);
      }
    } catch (e, st) {
      state = AsyncError<void>(e, st);
    }
  }

  Future<void> togglePrivacy(bool currentStatus) async {
    state = const AsyncLoading<void>();
    try {
      final ApiResponseStatus result = await _ref
          .read(togglePrivacyUseCaseProvider)
          .call();

      if (result.isSuccess) {
        _ref.read(currentUserProvider.notifier).updatePrivacy(!currentStatus);
        state = const AsyncData<void>(null);
      } else {
        state = AsyncError<void>(
          result.errorMessage.isEmpty
              ? 'Toggle privacy failed'
              : result.errorMessage,
          StackTrace.current,
        );
      }
    } catch (e, st) {
      state = AsyncError<void>(e, st);
    }
  }
}
