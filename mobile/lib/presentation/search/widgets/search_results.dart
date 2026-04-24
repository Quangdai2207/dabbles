import 'package:dabble/shared/widgets/ui/post_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/image/domain/entities/image_entity.dart';
import '../providers/search_provider.dart';
import '../states/search_state.dart';

class SearchResults extends ConsumerWidget {
  const SearchResults({super.key, required this.scrollController});

  final ScrollController scrollController;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final SearchState state = ref.watch(searchProvider);
    final List<ImageEntity> posts = state.postResults;
    final bool isLoading = state.isLoading;

    // Scroll Controller for infinite scroll could be passed or handled here
    // For simplicity using NotificationListener in parent or simple implementation

    if (posts.isEmpty && !isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Icon(Icons.search_off, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No posts found',
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      controller: scrollController,
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.7, // Adjust for image aspect ratio approximation
      ),
      itemCount: posts.length + (isLoading ? 2 : 0), // Show loading skeletons
      itemBuilder: (BuildContext context, int index) {
        if (index >= posts.length) {
          return ColoredBox(
            color: Colors.grey.shade200,
            child: const Center(child: CircularProgressIndicator()),
          );
        }

        final ImageEntity post = posts[index];

        return PostCard(post: post);
      },
    );
  }
}
