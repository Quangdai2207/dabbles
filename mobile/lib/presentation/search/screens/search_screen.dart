import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../providers/search_provider.dart';
import '../states/search_state.dart';
import '../widgets/search_results.dart';
import '../widgets/search_suggestions.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  late TextEditingController _controller;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (ref.read(searchProvider).showResults) {
        ref.read(searchProvider.notifier).loadMorePosts();
      }
    }
  }

  void _onClear() {
    _controller.clear();
    ref.read(searchProvider.notifier).clearSearch();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(searchProvider, (SearchState? previous, SearchState next) {
      if (next.selectedCategory != null && next.query != _controller.text) {
        _controller.text = next.query;
        _controller.selection = TextSelection.fromPosition(
          TextPosition(offset: next.query.length),
        );
      }
    });

    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final SearchState state = ref.watch(searchProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                controller: _controller,
                onChanged: ref.read(searchProvider.notifier).onQueryChanged,
                onSubmitted: (_) {
                  ref.read(searchProvider.notifier).searchPosts();
                },
                decoration: InputDecoration(
                  hintText: 'Search...',
                  hintStyle: TextStyle(color: theme.hintColor),
                  prefixIcon: Icon(
                    LucideIcons.search,
                    size: 20,
                    color: theme.iconTheme.color,
                  ),
                  suffixIcon: state.query.isNotEmpty
                      ? IconButton(
                          icon: const Icon(LucideIcons.x, size: 16),
                          onPressed: _onClear,
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: colorScheme.surfaceContainerHighest.withValues(
                    alpha: 0.5,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ),
            Expanded(child: _buildBody(context, state)),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, SearchState state) {
    // 1. Show Post Results
    if (state.showResults) {
      return SearchResults(scrollController: _scrollController);
    }

    // 2. Show Suggestions (Live search)
    if (state.query.isNotEmpty) {
      return const SearchSuggestions();
    }

    // 3. Default State (Empty)
    return const SizedBox.shrink();
  }
}
