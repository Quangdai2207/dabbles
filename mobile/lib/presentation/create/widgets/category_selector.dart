import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/network/api_response.dart';
import '../../../features/category/domain/entities/category_entity.dart';
import '../../../features/category/injection/category_injection.dart';

final FutureProvider<List<CategoryEntity>> categoriesProvider =
    FutureProvider<List<CategoryEntity>>((Ref ref) async {
      final ApiResponseObject<List<CategoryEntity>> result = await ref
          .read(getAllCategoriesUseCaseProvider)
          .call();
      if (result.isSuccess) {
        return result.data ?? <CategoryEntity>[];
      }
      throw Exception(
        result.errorMessage.isNotEmpty
            ? result.errorMessage
            : 'Failed to fetch categories',
      );
    });

class CategorySelector extends ConsumerStatefulWidget {
  const CategorySelector({
    super.key,
    required this.selectedIds,
    required this.onChanged,
  });

  final List<String> selectedIds;
  final ValueChanged<String> onChanged;

  @override
  ConsumerState<CategorySelector> createState() => _CategorySelectorState();
}

class _CategorySelectorState extends ConsumerState<CategorySelector> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final AsyncValue<List<CategoryEntity>> categoriesAsync = ref.watch(
      categoriesProvider,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Text(
          'Tags',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        TextField(
          onChanged: (String value) => setState(() => _searchQuery = value),
          decoration: InputDecoration(
            hintText: 'Search tags...',
            prefixIcon: const Icon(LucideIcons.search, size: 20),
            filled: true,
            fillColor: Colors.grey[100],
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
          ),
        ),
        const SizedBox(height: 12),
        categoriesAsync.when(
          data: (List<CategoryEntity> categories) {
            final List<CategoryEntity> filtered = categories
                .where(
                  (CategoryEntity c) =>
                      c.name.toLowerCase().contains(_searchQuery.toLowerCase()),
                )
                .toList();

            if (filtered.isEmpty) {
              return const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Center(
                  child: Text(
                    'No categories found.',
                    style: TextStyle(
                      fontStyle: FontStyle.italic,
                      color: Colors.grey,
                    ),
                  ),
                ),
              );
            }

            return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: filtered.map((CategoryEntity category) {
                  final bool isSelected = widget.selectedIds.contains(
                    category.id,
                  );
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => widget.onChanged(category.id),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Theme.of(context).primaryColor
                              : Colors.grey[100],
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? Theme.of(context).primaryColor
                                : Colors.transparent,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            if (isSelected)
                              const Padding(
                                padding: EdgeInsets.only(right: 6),
                                child: Icon(
                                  LucideIcons.tag,
                                  size: 14,
                                  color: Colors.white,
                                ),
                              ),
                            Text(
                              category.name,
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.white
                                    : Colors.black87,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (Object e, _) => Text('Error: $e'),
        ),
      ],
    );
  }
}
