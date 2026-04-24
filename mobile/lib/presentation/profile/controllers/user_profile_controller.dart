import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/api_response.dart';
import '../../../../features/contact/injection/contact_injection.dart';
import '../../../../features/user/domain/entities/user_entity.dart';
import '../../../../features/user/injection/user_injection.dart';
import '../states/user_profile_state.dart';

class UserProfileController extends StateNotifier<UserProfileState> {
  UserProfileController(this._ref, this._username)
    : super(const UserProfileState()) {
    loadProfile();
  }

  final Ref _ref;
  final String _username;

  Future<void> loadProfile({bool silent = false}) async {
    // Only set loading if it's the first load or explicit reload logic
    if (!silent && state.profile is! AsyncData) {
      state = state.copyWith(profile: const AsyncValue<UserEntity?>.loading());
    }

    try {
      final ApiResponseObject<UserEntity> response = await _ref
          .read(getUserProfileUseCaseProvider)
          .call(_username);

      if (response.isSuccess) {
        state = state.copyWith(
          profile: AsyncValue<UserEntity?>.data(response.data),
        );
      } else if (!silent) {
        state = state.copyWith(
          profile: AsyncValue<UserEntity?>.error(
            response.errorMessage.isNotEmpty
                ? response.errorMessage
                : 'Failed to load profile',
            StackTrace.current,
          ),
        );
      }
    } catch (e, st) {
      if (!silent) {
        state = state.copyWith(profile: AsyncValue<UserEntity?>.error(e, st));
      }
    }
  }

  Future<String?> followUser(String username) async {
    final ApiResponseStatus response = await _ref
        .read(handleContactRequestUseCaseProvider)
        .call(username, 'FOLLOW');

    if (response.isSuccess) {
      _optimisticUpdate(
        isFollowing: true,
        isRequested: state.profile.value?.isPrivate ?? false,
      );
      await _refreshProfiles();
      return null;
    }
    return response.errorMessage;
  }

  Future<String?> unfollowUser(String username) async {
    final ApiResponseStatus response = await _ref
        .read(handleContactActionUseCaseProvider)
        .call(username, 'UNFOLLOW');

    if (response.isSuccess) {
      _optimisticUpdate(isFollowing: false, isRequested: false);
      await _refreshProfiles();
      return null;
    }
    return response.errorMessage;
  }

  Future<String?> acceptRequest(String username) async {
    final ApiResponseStatus response = await _ref
        .read(handleContactRequestUseCaseProvider)
        .call(username, 'ACCEPTED');

    if (response.isSuccess) {
      _optimisticUpdate(isFollowing: false, isFollower: true);
      await _refreshProfiles();
      return null;
    }
    return response.errorMessage;
  }

  Future<String?> denyRequest(String username) async {
    final ApiResponseStatus response = await _ref
        .read(handleContactRequestUseCaseProvider)
        .call(username, 'DENY');

    if (response.isSuccess) {
      _optimisticUpdate(isFollower: false);
      await _refreshProfiles();
      return null;
    }
    return response.errorMessage;
  }

  Future<String?> blockUser(String username) async {
    final ApiResponseStatus response = await _ref
        .read(handleContactActionUseCaseProvider)
        .call(username, 'BLOCK');

    if (response.isSuccess) {
      // After block, we typically navigate away or clear state
      state = state.copyWith(profile: const AsyncValue<UserEntity?>.data(null));
      _ref.invalidate(currentUserProvider);
      return null;
    }
    return response.errorMessage;
  }

  Future<String?> removeFollower(String username) async {
    final ApiResponseStatus response = await _ref
        .read(removeFollowerUseCaseProvider)
        .call(username);

    if (response.isSuccess) {
      _optimisticUpdate(isFollower: false);
      await _refreshProfiles();
      return null;
    }
    return response.errorMessage;
  }

  void _optimisticUpdate({
    bool? isFollowing,
    bool? isRequested,
    bool? isFollower,
  }) {
    final UserEntity? currentProfile = state.profile.value;
    if (currentProfile != null) {
      int followerCount = currentProfile.follower;
      if (isFollowing != null && isFollowing != currentProfile.isFollowing) {
        followerCount += isFollowing ? 1 : -1;
      }

      state = state.copyWith(
        profile: AsyncValue<UserEntity?>.data(
          currentProfile.copyWith(
            isFollowing: isFollowing,
            isRequested: isRequested,
            isFollower: isFollower,
            follower: followerCount < 0 ? 0 : followerCount,
          ),
        ),
      );
    }
  }

  Future<void> _refreshProfiles() async {
    // Refresh the displayed profile in background
    await loadProfile(silent: true);
    // Refresh current user profile as follows/counts might change
    _ref.invalidate(currentUserProvider);
  }
}
