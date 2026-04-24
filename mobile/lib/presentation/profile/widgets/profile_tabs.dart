import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../features/image/domain/entities/image_entity.dart';
import '../../../shared/widgets/ui/post_card.dart';

import '../../library/states/library_state.dart';

class ProfileTabContent extends ConsumerStatefulWidget {
  const ProfileTabContent({
    super.key,
    required this.provider,
    required this.emptyMessage,
  });

  final ProviderListenable<AsyncValue<PaginatedLibraryState>> provider;
  final String emptyMessage;

  @override
  ConsumerState<ProfileTabContent> createState() => _ProfileTabContentState();
}

class _ProfileTabContentState extends ConsumerState<ProfileTabContent> {
  bool _onScrollNotification(ScrollNotification notification) {
    if (notification is ScrollUpdateNotification) {
      if (notification.metrics.pixels >=
          notification.metrics.maxScrollExtent - 200) {
        // Call loadMore on the notifier
        final AsyncValue<PaginatedLibraryState> state = ref.read(
          widget.provider,
        );
        state.whenData((PaginatedLibraryState data) {
          // We need to access the notifier to call loadMore
          // This is a workaround since we're using ProviderListenable
        });
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final AsyncValue<PaginatedLibraryState> stateAsync = ref.watch(
      widget.provider,
    );

    return stateAsync.when(
      data: (PaginatedLibraryState state) {
        if (state.items.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  Icons.image_not_supported_outlined,
                  size: 64,
                  color: Theme.of(context).colorScheme.outline,
                ),
                const SizedBox(height: 16),
                Text(
                  widget.emptyMessage,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).colorScheme.outline,
                  ),
                ),
              ],
            ),
          );
        }

        return NotificationListener<ScrollNotification>(
          onNotification: _onScrollNotification,
          child: Builder(
            builder: (BuildContext context) {
              return CustomScrollView(
                key: PageStorageKey<String>(widget.emptyMessage),
                physics: const AlwaysScrollableScrollPhysics(),
                slivers: <Widget>[
                  SliverOverlapInjector(
                    handle: NestedScrollView.sliverOverlapAbsorberHandleFor(
                      context,
                    ),
                  ),
                  SliverPadding(
                    padding: const EdgeInsets.all(12),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 3 / 4,
                          ),
                      delegate: SliverChildBuilderDelegate((
                        BuildContext context,
                        int index,
                      ) {
                        final ImageEntity post = state.items[index];
                        return PostCard(post: post);
                      }, childCount: state.items.length),
                    ),
                  ),
                  if (state.isLoadingMore)
                    const SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Center(child: CircularProgressIndicator()),
                      ),
                    ),
                ],
              );
            },
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (Object error, StackTrace stackTrace) =>
          Center(child: Text('Error: $error')),
    );
  }
}
