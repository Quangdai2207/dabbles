import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CurrentUserNotifier extends StateNotifier<AsyncValue<ProfileEntity?>> {
  CurrentUserNotifier(this._ref)
    : super(const AsyncData<ProfileEntity?>(null)) {
    _init();
  }

  final Ref _ref;

  Future<void> _init() async {
    final bool isLoggedIn = _ref.read(authStateProvider).value ?? false;
    if (isLoggedIn) {
      await fetchProfile();
    }
  }

  Future<void> fetchProfile() async {
    state = const AsyncLoading<ProfileEntity?>();
    final ApiResponseObject<ProfileEntity> result = await _ref
        .read(getProfileUseCaseProvider)
        .call();
    if (result.isSuccess && result.data != null) {
      state = AsyncData<ProfileEntity?>(result.data!);
    } else {
      state = AsyncError<ProfileEntity?>(
        result.errorMessage.isEmpty
            ? 'Failed to fetch profile'
            : result.errorMessage,
        StackTrace.current,
      );
    }
  }

  void setProfile(ProfileEntity profile) {
    state = AsyncData<ProfileEntity?>(profile);
  }

  void updatePrivacy(bool isPublic) {
    if (state.value != null) {
      // Create a copyWith method in Entity or manually copy
      // Since Entity assumes const, we create a new one.
      // Assuming ProfileEntity doesn't have copyWith yet.
      final ProfileEntity current = state.value!;
      final ProfileEntity updated = ProfileEntity(
        id: current.id,
        email: current.email,
        username: current.username,
        firstName: current.firstName,
        lastName: current.lastName,
        avatar: current.avatar,
        bio: current.bio,
        public: isPublic,
        phone: current.phone,
        dob: current.dob,
        expiredDay: current.expiredDay,
        warning: current.warning,
        createdAt: current.createdAt,
        updatedAt: current.updatedAt,
      );
      state = AsyncData<ProfileEntity?>(updated);
    }
  }

  void clear() {
    state = const AsyncData<ProfileEntity?>(null);
  }
}

final StateNotifierProvider<CurrentUserNotifier, AsyncValue<ProfileEntity?>>
currentUserProvider =
    StateNotifierProvider<CurrentUserNotifier, AsyncValue<ProfileEntity?>>(
      CurrentUserNotifier.new,
    );
