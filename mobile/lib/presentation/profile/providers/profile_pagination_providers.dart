import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../library/states/library_state.dart';
import '../controllers/profile_pagination_controller.dart';
export '../controllers/profile_pagination_controller.dart';

/// Provider family for profile user posts pagination
final AutoDisposeAsyncNotifierProviderFamily<
  ProfileUserPostsPaginationNotifier,
  PaginatedLibraryState,
  String
>
profileUserPostsPaginationProvider = AsyncNotifierProvider.autoDispose
    .family<ProfileUserPostsPaginationNotifier, PaginatedLibraryState, String>(
      ProfileUserPostsPaginationNotifier.new,
    );
