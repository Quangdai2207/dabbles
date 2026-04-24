import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/library_pagination_controller.dart';
import '../states/library_state.dart';
export '../controllers/library_pagination_controller.dart';

final AsyncNotifierProvider<UserPostsPaginationNotifier, PaginatedLibraryState>
userPostsPaginationProvider =
    AsyncNotifierProvider<UserPostsPaginationNotifier, PaginatedLibraryState>(
      UserPostsPaginationNotifier.new,
    );

final AsyncNotifierProvider<LikedPostsPaginationNotifier, PaginatedLibraryState>
likedPostsPaginationProvider =
    AsyncNotifierProvider<LikedPostsPaginationNotifier, PaginatedLibraryState>(
      LikedPostsPaginationNotifier.new,
    );

final AsyncNotifierProvider<
  PurchasedPostsPaginationNotifier,
  PaginatedLibraryState
>
purchasedPostsPaginationProvider =
    AsyncNotifierProvider<
      PurchasedPostsPaginationNotifier,
      PaginatedLibraryState
    >(PurchasedPostsPaginationNotifier.new);
