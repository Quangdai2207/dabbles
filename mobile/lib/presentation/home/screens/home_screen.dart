import 'package:dabble/features/image/domain/entities/image_entity.dart';
import 'package:dabble/presentation/home/providers/home_feed_provider.dart';
import 'package:dabble/presentation/home/states/home_feed_state.dart';
import 'package:dabble/shared/widgets/ui/post_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  bool _onScrollNotification(ScrollNotification notification) {
    if (notification is ScrollEndNotification &&
        _scrollController.position.extentAfter == 0) {
      ref.read(homeFeedProvider.notifier).loadMore();
    }
    return false;
  }

  Future<void> _onRefresh() async {
    await ref.read(homeFeedProvider.notifier).refresh();
  }

  @override
  Widget build(BuildContext context) {
    final AsyncValue<HomeFeedState> feedState = ref.watch(homeFeedProvider);
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      body: NotificationListener<ScrollNotification>(
        onNotification: _onScrollNotification,
        child: RefreshIndicator(
          onRefresh: _onRefresh,
          child: CustomScrollView(
            controller: _scrollController,
            slivers: <Widget>[
              // Optional: Add a welcoming header or keep it clean
              feedState.when(
                data: (HomeFeedState state) {
                  if (state.items.isEmpty) {
                    return SliverFillRemaining(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            Text(
                              'No posts yet',
                              style: theme.textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            OutlinedButton(
                              onPressed: _onRefresh,
                              child: const Text('Refresh'),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  const double gap = 16;

                  return SliverPadding(
                    padding: EdgeInsets.symmetric(
                      horizontal: gap,
                      vertical: gap,
                    ),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: gap,
                            mainAxisSpacing: gap,
                            childAspectRatio: 0.6,
                          ),
                      delegate: SliverChildBuilderDelegate((
                        BuildContext context,
                        int index,
                      ) {
                        final ImageEntity post = state.items[index];
                        return PostCard(post: post);
                      }, childCount: state.items.length),
                    ),
                  );
                },
                loading: () => const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (Object error, StackTrace stack) => SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Text('Error: $error'),
                        const SizedBox(height: 16),
                        OutlinedButton(
                          onPressed: _onRefresh,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Loading indicator at the bottom
              SliverToBoxAdapter(
                child: feedState.maybeWhen(
                  data: (HomeFeedState state) => state.hasMore
                      ? const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Center(child: CircularProgressIndicator()),
                        )
                      : const SizedBox(height: 24),
                  orElse: () => const SizedBox.shrink(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
