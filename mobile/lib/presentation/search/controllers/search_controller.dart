import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_response.dart';
import '../../../features/category/domain/entities/category_entity.dart';
import '../../../features/category/injection/category_injection.dart';
import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/image/injection/image_injection.dart';
import '../../../features/user/domain/entities/user_basic_entity.dart';
import '../../../features/user/injection/user_injection.dart';
import '../../../shared/utils/app_log.dart';

// State
import '../states/search_state.dart';

// Notifier
class SearchNotifier extends StateNotifier<SearchState> {
  SearchNotifier(this.ref) : super(const SearchState()) {
    _init();
  }

  final Ref ref;
  Timer? _debounceTimer;

  Future<void> _init() async {
    // Load all categories for local filtering
    final ApiResponseObject<List<CategoryEntity>> response = await ref
        .read(categoryRepositoryProvider)
        .getAllCategories();
    if (response.isSuccess && response.data != null) {
      state = state.copyWith(allCategories: response.data);
    }
  }

  void onQueryChanged(String query) {
    if (_debounceTimer?.isActive ?? false) _debounceTimer!.cancel();

    if (query.isEmpty) {
      state = state.copyWith(
        query: '',
        showResults: false,
        foundUsers: <UserBasicEntity>[],
        foundCategories: <CategoryEntity>[],
        selectedCategory: null, // Reset category selection
      );
      return;
    }

    // If user types, we should probably clear any selected category to allow free search
    // But we only do this if the query changed significantly or user intent is typing.
    // For now, let's clear selectedCategory to be safe.
    state = state.copyWith(
      query: query,
      showResults: false,
      selectedCategory: null, // Clear category when typing
    );

    _debounceTimer = Timer(const Duration(milliseconds: 300), () {
      _searchUsersAndTags(query);
    });
  }

  void selectCategory(String slug) {
    try {
      AppLog.info('Selecting category: $slug');

      String name = slug;
      // Simplified name lookup
      if (state.allCategories.isNotEmpty) {
        final Iterable<CategoryEntity> match = state.allCategories.where(
          (CategoryEntity e) => e.slug == slug,
        );
        if (match.isNotEmpty) name = match.first.name;
      }

      AppLog.info('Category selected: $name ($slug). triggering search.');

      state = state.copyWith(
        selectedCategory: slug,
        // query: name, // COMMENTED OUT: Do not update query text to avoid triggering potential listeners or UI confusion for now
        showResults: true,
        foundCategories: <CategoryEntity>[],
        foundUsers: <UserBasicEntity>[],
      );
      searchPosts(categorySlug: slug);
    } catch (e, stack) {
      AppLog.error('Error in selectCategory', e, stack);
    }
  }

  Future<void> _searchUsersAndTags(String query) async {
    state = state.copyWith(isLoading: true);

    // Filter categories locally
    final List<CategoryEntity> matchingCategories = state.allCategories
        .where(
          (CategoryEntity c) =>
              c.name.toLowerCase().contains(query.toLowerCase()),
        )
        .toList();

    // Search users via API
    final ApiResponseObject<List<UserBasicEntity>> userResponse = await ref
        .read(userRepositoryProvider)
        .searchUsers(query);

    List<UserBasicEntity> users = <UserBasicEntity>[];
    if (userResponse.isSuccess && userResponse.data != null) {
      users = userResponse.data!;
    }

    state = state.copyWith(
      isLoading: false,
      foundCategories: matchingCategories,
      foundUsers: users,
    );
  }

  Future<void> searchPosts({String? categorySlug}) async {
    final String currentQuery = state.query;
    final String? currentCategory = categorySlug ?? state.selectedCategory;

    AppLog.info(
      'Searching posts with query: "$currentQuery", category: "$currentCategory"',
    );

    // Reset results for new search
    state = state.copyWith(
      isLoading: true,
      showResults: true,
      postResults: <ImageEntity>[],
      page: 0,
      hasMore: true,
      selectedCategory: currentCategory,
    );

    // Call Image Search API
    // If categorySlug is passed, use it, otherwise use query if no category selected
    // Note: If searching by category, query might be empty or irrelevant for the API call if the intent is browsing category
    // Logic: If category selected, pass category. If not, pass query as keyword.

    final ApiResponseObject<List<ImageEntity>> response = await ref
        .read(imageRepositoryProvider)
        .searchImages(
          page: 0,
          keyword: currentCategory != null ? null : currentQuery,
          category: currentCategory,
        );

    if (response.isSuccess && response.data != null) {
      AppLog.info('Search success. Found ${response.data!.length} posts.');
      state = state.copyWith(
        isLoading: false,
        postResults: response.data,
        hasMore: response.data!.isNotEmpty,
      );
    } else {
      AppLog.error('Search failed: ${response.errorMessage}');
      state = state.copyWith(isLoading: false, hasMore: false);
    }
  }

  Future<void> loadMorePosts() async {
    if (state.isLoading || !state.hasMore) return;

    final int nextPage = state.page + 1;
    state = state.copyWith(
      isLoading: true,
    ); // Or keep separate loadingMore state

    final ApiResponseObject<List<ImageEntity>> response = await ref
        .read(imageRepositoryProvider)
        .searchImages(
          page: nextPage,
          keyword: state.selectedCategory != null ? null : state.query,
          category: state.selectedCategory,
        );

    if (response.isSuccess && response.data != null) {
      if (response.data!.isEmpty) {
        state = state.copyWith(isLoading: false, hasMore: false);
      } else {
        state = state.copyWith(
          isLoading: false,
          postResults: <ImageEntity>[...state.postResults, ...response.data!],
          page: nextPage,
        );
      }
    } else {
      state = state.copyWith(isLoading: false, hasMore: false);
    }
  }

  void clearSearch() {
    state = state.copyWith(
      query: '',
      showResults: false,
      foundUsers: <UserBasicEntity>[],
      foundCategories: <CategoryEntity>[],
      postResults: <ImageEntity>[],
      page: 0,
      hasMore: true,
      selectedCategory: null,
    );
  }
}
