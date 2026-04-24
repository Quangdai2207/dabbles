import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_response.dart';
import '../../../features/auth/domain/entities/profile_entity.dart';
import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/image/injection/image_injection.dart';
import '../providers/library_providers.dart';

import '../states/library_state.dart';

abstract class LibraryPaginationNotifier
    extends AsyncNotifier<PaginatedLibraryState> {
  Future<ApiResponseObject<List<ImageEntity>>> fetchImages(int page);

  @override
  Future<PaginatedLibraryState> build() async {
    final ApiResponseObject<List<ImageEntity>> response = await fetchImages(0);
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
    final ApiResponseObject<List<ImageEntity>> response = await fetchImages(
      nextPage,
    );

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

class UserPostsPaginationNotifier extends LibraryPaginationNotifier {
  @override
  Future<ApiResponseObject<List<ImageEntity>>> fetchImages(int page) async {
    final ProfileEntity? profile = await ref.watch(authProfileProvider.future);
    if (profile == null) {
      return ApiResponseObject<List<ImageEntity>>.error('Profile not found');
    }
    return ref
        .read(getUserImagesUseCaseProvider)
        .call(profile.username, page: page);
  }
}

class LikedPostsPaginationNotifier extends LibraryPaginationNotifier {
  @override
  Future<ApiResponseObject<List<ImageEntity>>> fetchImages(int page) async {
    return ref.read(getLikedImagesUseCaseProvider).call(page: page);
  }
}

class PurchasedPostsPaginationNotifier extends LibraryPaginationNotifier {
  @override
  Future<ApiResponseObject<List<ImageEntity>>> fetchImages(int page) async {
    return ref.read(getPurchasedImagesUseCaseProvider).call(page: page);
  }
}
