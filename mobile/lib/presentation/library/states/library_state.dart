import '../../../features/image/domain/entities/image_entity.dart';

class PaginatedLibraryState {
  const PaginatedLibraryState({
    required this.items,
    required this.page,
    required this.hasMore,
    required this.isLoadingMore,
  });

  final List<ImageEntity> items;
  final int page;
  final bool hasMore;
  final bool isLoadingMore;

  PaginatedLibraryState copyWith({
    List<ImageEntity>? items,
    int? page,
    bool? hasMore,
    bool? isLoadingMore,
  }) {
    return PaginatedLibraryState(
      items: items ?? this.items,
      page: page ?? this.page,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}
