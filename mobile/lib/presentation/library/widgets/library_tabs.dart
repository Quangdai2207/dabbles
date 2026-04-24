import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/image/domain/entities/image_entity.dart';
import '../../../shared/widgets/ui/post_card.dart';
import '../providers/library_pagination_providers.dart';
import '../states/library_state.dart';

class LibraryTabContent extends ConsumerStatefulWidget {
  const LibraryTabContent({
    super.key,
    required this.provider,
    required this.emptyMessage,
  });

  final AsyncNotifierProvider<LibraryPaginationNotifier, PaginatedLibraryState>
  provider;
  final String emptyMessage;

  @override
  ConsumerState<LibraryTabContent> createState() => _LibraryTabContentState();
}

class _LibraryTabContentState extends ConsumerState<LibraryTabContent> {
  bool _onScrollNotification(ScrollNotification notification) {
    if (notification is ScrollUpdateNotification) {
      if (notification.metrics.pixels >=
          notification.metrics.maxScrollExtent - 200) {
        ref.read(widget.provider.notifier).loadMore();
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
        return RefreshIndicator(
          onRefresh: () async {
            // Refresh the provider logic
            return ref.refresh(widget.provider.future);
          },
          child: NotificationListener<ScrollNotification>(
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
                    if (state.items.isEmpty)
                      SliverFillRemaining(
                        hasScrollBody: false,
                        child: Center(
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
                                style: Theme.of(context).textTheme.bodyLarge
                                    ?.copyWith(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.outline,
                                    ),
                              ),
                            ],
                          ),
                        ),
                      )
                    else ...<Widget>[
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
                  ],
                );
              },
            ),
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (Object error, StackTrace stackTrace) =>
          Center(child: Text('Error: $error')),
    );
  }
}
