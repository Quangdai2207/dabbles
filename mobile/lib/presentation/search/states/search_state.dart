import 'package:equatable/equatable.dart';

import '../../../features/category/domain/entities/category_entity.dart';
import '../../../features/image/domain/entities/image_entity.dart';
import '../../../features/user/domain/entities/user_basic_entity.dart';

class SearchState extends Equatable {
  const SearchState({
    this.query = '',
    this.isLoading = false,
    this.showResults = false,
    this.foundUsers = const <UserBasicEntity>[],
    this.foundCategories = const <CategoryEntity>[],
    this.allCategories = const <CategoryEntity>[],
    this.postResults = const <ImageEntity>[],
    this.page = 0,
    this.hasMore = true,
    this.selectedCategory,
  });

  final String query;
  final bool isLoading;
  final bool showResults;
  final List<UserBasicEntity> foundUsers;
  final List<CategoryEntity> foundCategories;
  final List<CategoryEntity> allCategories;
  final List<ImageEntity> postResults;
  final int page;
  final bool hasMore;
  final String? selectedCategory;

  SearchState copyWith({
    String? query,
    bool? isLoading,
    bool? showResults,
    List<UserBasicEntity>? foundUsers,
    List<CategoryEntity>? foundCategories,
    List<CategoryEntity>? allCategories,
    List<ImageEntity>? postResults,
    int? page,
    bool? hasMore,
    String? selectedCategory,
  }) {
    return SearchState(
      query: query ?? this.query,
      isLoading: isLoading ?? this.isLoading,
      showResults: showResults ?? this.showResults,
      foundUsers: foundUsers ?? this.foundUsers,
      foundCategories: foundCategories ?? this.foundCategories,
      allCategories: allCategories ?? this.allCategories,
      postResults: postResults ?? this.postResults,
      page: page ?? this.page,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    query,
    isLoading,
    showResults,
    foundUsers,
    foundCategories,
    allCategories,
    postResults,
    page,
    hasMore,
    selectedCategory,
  ];
}
