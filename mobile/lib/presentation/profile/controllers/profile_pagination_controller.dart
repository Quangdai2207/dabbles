import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_response.dart';
import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/image/injection/image_injection.dart';

import '../../library/states/library_state.dart';

/// Pagination notifier for viewing a specific user's posts
class ProfileUserPostsPaginationNotifier
    extends AutoDisposeFamilyAsyncNotifier<PaginatedLibraryState, String> {
  @override
  Future<PaginatedLibraryState> build(String username) async {
    final ApiResponseObject<List<ImageEntity>> response = await ref
        .read(getUserImagesUseCaseProvider)
        .call(username, page: 0);
    final List<ImageEntity> items = response.isSuccess
        ? response.data ?? <ImageEntity>[]
        : <ImageEntity>[];

    return PaginatedLibraryState(
      items: items,
      page: 0,
      hasMore: items.isNotEmpty && items.length >= 10,
      isLoadingMore: false,
    );
  }

  Future<void> loadMore() async {
    final PaginatedLibraryState? currentState = state.value;
    if (currentState == null ||
        currentState.isLoadingMore ||
        !currentState.hasMore) {
      return;
    }

    state = AsyncData<PaginatedLibraryState>(
      currentState.copyWith(isLoadingMore: true),
    );

    final int nextPage = currentState.page + 1;
    final String username = arg; // Get username from family parameter
    final ApiResponseObject<List<ImageEntity>> response = await ref
        .read(getUserImagesUseCaseProvider)
        .call(username, page: nextPage);

    if (response.isSuccess) {
      final List<ImageEntity> newItems = response.data ?? <ImageEntity>[];
      state = AsyncData<PaginatedLibraryState>(
        currentState.copyWith(
          items: <ImageEntity>[...currentState.items, ...newItems],
          page: nextPage,
          hasMore: newItems.isNotEmpty && newItems.length >= 10,
          isLoadingMore: false,
        ),
      );
    } else {
      state = AsyncData<PaginatedLibraryState>(
        currentState.copyWith(isLoadingMore: false),
      );
    }
  }
}
