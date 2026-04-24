import 'package:dabble/core/network/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/image/injection/image_injection.dart';

import '../controllers/user_profile_controller.dart';
import '../states/user_profile_state.dart';

/// Provider for viewing a specific user's profile by username
final AutoDisposeStateNotifierProviderFamily<
  UserProfileController,
  UserProfileState,
  String
>
userProfileControllerProvider = StateNotifierProvider.autoDispose
    .family<UserProfileController, UserProfileState, String>((
      Ref ref,
      String username,
    ) {
      return UserProfileController(ref, username);
    });

/// Provider for viewing a specific user's posts by username
final AutoDisposeFutureProviderFamily<List<ImageEntity>, String>
profileUserPostsProvider = FutureProvider.autoDispose
    .family<List<ImageEntity>, String>((Ref ref, String username) async {
      final ApiResponseObject<List<ImageEntity>> response = await ref
          .read(getUserImagesUseCaseProvider)
          .call(username);
      return response.isSuccess ? response.data! : <ImageEntity>[];
    });
