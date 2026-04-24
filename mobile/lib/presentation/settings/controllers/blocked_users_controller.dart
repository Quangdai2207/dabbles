import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/contact/domain/entities/contact_user_entity.dart';
import 'package:dabble/features/contact/injection/contact_injection.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../states/blocked_users_state.dart';

class BlockedUsersController extends StateNotifier<BlockedUsersState> {
  BlockedUsersController(this._ref) : super(const BlockedUsersState()) {
    fetchBlockedUsers();
  }

  final Ref _ref;

  Future<void> fetchBlockedUsers() async {
    state = state.copyWith(
      status: const AsyncLoading<List<ContactUserEntity>>(),
    );
    final ApiResponseObject<List<ContactUserEntity>> result = await _ref
        .read(getBlockedUseCaseProvider)
        .call();

    if (result.isSuccess && result.data != null) {
      state = state.copyWith(
        status: AsyncData<List<ContactUserEntity>>(result.data!),
      );
    } else {
      state = state.copyWith(
        status: AsyncError<List<ContactUserEntity>>(
          result.errorMessage.isEmpty
              ? 'Failed to fetch blocked users'
              : result.errorMessage,
          StackTrace.current,
        ),
      );
    }
  }

  Future<String?> unblockUser(String username) async {
    // Optimistic update
    final List<ContactUserEntity> currentList =
        state.status.value ?? <ContactUserEntity>[];

    final ApiResponseStatus result = await _ref
        .read(handleContactActionUseCaseProvider)
        .call(username, 'UNBLOCK');

    if (result.isSuccess) {
      // successful unblock
      state = state.copyWith(
        status: AsyncData<List<ContactUserEntity>>(
          currentList
              .where((ContactUserEntity user) => user.username != username)
              .toList(),
        ),
      );
      return null;
    } else {
      // Revert or show error
      return result.errorMessage.isEmpty
          ? 'Unblock failed'
          : result.errorMessage;
    }
  }
}
