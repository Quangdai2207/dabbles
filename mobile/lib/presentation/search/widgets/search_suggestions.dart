import 'package:dabble/features/category/domain/entities/category_entity.dart';
import 'package:dabble/features/user/domain/entities/user_basic_entity.dart';
import 'package:dabble/shared/utils/app_log.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../providers/search_provider.dart';
import '../states/search_state.dart';

class SearchSuggestions extends ConsumerWidget {
  const SearchSuggestions({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final SearchState searchState = ref.watch(searchProvider);
    final String query = searchState.query;
    final List<UserBasicEntity> users = searchState.foundUsers;
    final List<CategoryEntity> categories = searchState.foundCategories;
    final bool isLoading = searchState.isLoading;

    if (query.isEmpty) {
      // Ideally show "Recent History" here, but for now empty or default suggestions
      return const SizedBox.shrink();
    }

    if (isLoading && users.isEmpty && categories.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (users.isEmpty && categories.isEmpty) {
      return Center(
        child: Text(
          'No results found for "$query"',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: <Widget>[
        if (categories.isNotEmpty) ...<Widget>[
          _buildHeader(context, 'TAGS'),
          ...categories.map(
            (CategoryEntity category) => ListTile(
              leading: const Icon(LucideIcons.hash, size: 20),
              title: Text(category.name),
              onTap: () {
                AppLog.info("click tag ${category.name}");
                ref.read(searchProvider.notifier).selectCategory(category.slug);
                FocusScope.of(context).unfocus();
              },
            ),
          ),
          const Divider(),
        ],
        if (users.isNotEmpty) ...<Widget>[
          _buildHeader(context, 'USERS'),
          ...users.map(
            (UserBasicEntity user) => ListTile(
              leading: UserAvatar(
                // Replaced CircleAvatar with UserAvatar
                avatarUrl: user.avatar,
                name: user.name,
                radius: 16,
              ),
              title: Text(
                user.name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text('@${user.username}'),
              onTap: () {
                Navigator.of(context).pushNamed('/u/${user.username}');
                FocusScope.of(context).unfocus();
              },
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).colorScheme.secondary,
        ),
      ),
    );
  }
}
