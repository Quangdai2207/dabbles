import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_response.dart';
import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/image/injection/image_injection.dart';

import '../states/home_feed_state.dart';

class HomeFeedNotifier extends AsyncNotifier<HomeFeedState> {
  Future<ApiResponseObject<List<ImageEntity>>> _fetchImages(int page) async {
    return ref.read(getHomeFeedUseCaseProvider).call(page: page);
  }

  @override
  Future<HomeFeedState> build() async {
    final ApiResponseObject<List<ImageEntity>> response = await _fetchImages(0);
    final List<ImageEntity> items = response.isSuccess
        ? response.data ?? <ImageEntity>[]
        : <ImageEntity>[];

    return HomeFeedState(
      items: items,
      page: 0,
      hasMore: items.isNotEmpty && items.length >= 10,
      isLoadingMore: false,
    );
  }

  Future<void> loadMore() async {
    final HomeFeedState? currentState = state.value;
    if (currentState == null ||
        currentState.isLoadingMore ||
        !currentState.hasMore) {
      return;
    }

    state = AsyncData<HomeFeedState>(
      currentState.copyWith(isLoadingMore: true),
    );

    final int nextPage = currentState.page + 1;
    final ApiResponseObject<List<ImageEntity>> response = await _fetchImages(
      nextPage,
    );

    if (response.isSuccess) {
      final List<ImageEntity> newItems = response.data ?? <ImageEntity>[];
      state = AsyncData<HomeFeedState>(
        currentState.copyWith(
          items: <ImageEntity>[...currentState.items, ...newItems],
          page: nextPage,
          hasMore: newItems.isNotEmpty && newItems.length >= 10,
          isLoadingMore: false,
        ),
      );
    } else {
      state = AsyncData<HomeFeedState>(
        currentState.copyWith(isLoadingMore: false),
      );
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading<HomeFeedState>();
    state = await AsyncValue.guard(build);
  }
}
