import 'package:dabble/core/network/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/auth/domain/entities/profile_entity.dart';
import '../../../../features/user/domain/entities/user_entity.dart';
import '../../../../features/user/injection/user_injection.dart';
import '../providers/library_providers.dart';
import '../states/library_screen_state.dart';

class LibraryController extends StateNotifier<LibraryScreenState> {
  LibraryController(this.ref) : super(const LibraryScreenState()) {
    loadProfile();
  }

  final Ref ref;

  Future<void> loadProfile() async {
    state = state.copyWith(
      userProfile: const AsyncValue<UserEntity?>.loading(),
    );

    final ProfileEntity? authProfile = await ref.read(
      authProfileProvider.future,
    );
    if (authProfile == null) {
      state = state.copyWith(
        userProfile: const AsyncValue<UserEntity?>.data(null),
      );
      return;
    }

    final ApiResponseObject<UserEntity> response = await ref
        .read(getUserProfileUseCaseProvider)
        .call(authProfile.username);

    if (response.isSuccess) {
      state = state.copyWith(
        userProfile: AsyncValue<UserEntity?>.data(response.data),
      );
    } else {
      state = state.copyWith(
        userProfile: AsyncValue<UserEntity?>.error(
          response.errorMessage,
          StackTrace.current,
        ),
      );
    }
  }
}
