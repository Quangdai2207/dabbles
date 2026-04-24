import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/features/user/domain/entities/user_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/ui/common_app_bar.dart';
import '../../../shared/widgets/ui/full_screen_image_viewer.dart';
import '../../../shared/widgets/user_avatar.dart';
import '../../library/providers/library_pagination_providers.dart';
import '../../library/widgets/library_stat_column.dart';
import '../../library/widgets/library_tabs.dart';
import '../../library/widgets/library_vertical_divider.dart';
import '../controllers/user_profile_controller.dart';
import '../providers/profile_pagination_providers.dart';
import '../providers/profile_providers.dart';
import '../states/user_profile_state.dart';
import '../widgets/profile_action_buttons.dart';
import '../widgets/profile_tabs.dart';

class UserProfileScreen extends ConsumerWidget {
  const UserProfileScreen({super.key, required this.username});

  final String username;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final UserProfileState state = ref.watch(
      userProfileControllerProvider(username),
    );
    final UserProfileController controller = ref.read(
      userProfileControllerProvider(username).notifier,
    );
    final AsyncValue<ProfileEntity?> authProfileAsync = ref.watch(
      currentUserProvider,
    );
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      appBar: CommonAppBar(title: '@$username'),
      body: state.profile.when(
        data: (UserEntity? profile) {
          if (profile == null) {
            return const Center(child: Text('User not found'));
          }

          // Check if viewing own profile
          final bool isOwnProfile =
              authProfileAsync.value?.username == username;
          final int tabCount = isOwnProfile ? 3 : 1;

          return DefaultTabController(
            length: tabCount,
            child: NestedScrollView(
              headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
                return <Widget>[
                  // Header (Profile + Stats)
                  SliverAppBar(
                    expandedHeight: 300,
                    floating: false,
                    pinned: false,
                    automaticallyImplyLeading: false,
                    backgroundColor: theme.colorScheme.surface,
                    flexibleSpace: FlexibleSpaceBar(
                      collapseMode: CollapseMode.pin,
                      background: Padding(
                        padding: const EdgeInsets.only(bottom: 0),
                        child: RefreshIndicator(
                          onRefresh: () async {
                            await controller.loadProfile();
                          },
                          child: SingleChildScrollView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            child: Column(
                              children: <Widget>[
                                Container(
                                  padding: const EdgeInsets.fromLTRB(
                                    24,
                                    24,
                                    24,
                                    24,
                                  ),
                                  child: Column(
                                    children: <Widget>[
                                      Row(
                                        children: <Widget>[
                                          DecoratedBox(
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              border: Border.all(
                                                color: theme.colorScheme.primary
                                                    .withAlpha(51),
                                                width: 3,
                                              ),
                                            ),
                                            child: GestureDetector(
                                              onTap: () {
                                                if (profile.avatar != null) {
                                                  Navigator.push(
                                                    context,
                                                    MaterialPageRoute<void>(
                                                      builder:
                                                          (
                                                            BuildContext
                                                            context,
                                                          ) => FullScreenImageViewer(
                                                            imageUrl:
                                                                profile.avatar!,
                                                            heroTag:
                                                                'profile_avatar_${profile.username}',
                                                          ),
                                                    ),
                                                  );
                                                }
                                              },
                                              child: Hero(
                                                tag:
                                                    'profile_avatar_${profile.username}',
                                                child: UserAvatar(
                                                  avatarUrl: profile.avatar,
                                                  radius: 40,
                                                ),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 20),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  profile.firstName != null
                                                      ? '${profile.firstName} ${profile.lastName}'
                                                      : profile.username,
                                                  style: theme
                                                      .textTheme
                                                      .headlineSmall
                                                      ?.copyWith(
                                                        fontWeight:
                                                            FontWeight.w900,
                                                        color: theme
                                                            .colorScheme
                                                            .onSurface,
                                                        letterSpacing: -0.5,
                                                      ),
                                                ),
                                                const SizedBox(height: 2),
                                                Text(
                                                  '@${profile.username}',
                                                  style: theme
                                                      .textTheme
                                                      .bodyMedium
                                                      ?.copyWith(
                                                        color: theme
                                                            .colorScheme
                                                            .primary,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                      ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 24),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        children: <Widget>[
                                          LibraryStatColumn(
                                            label: 'Followers',
                                            value: profile.follower.toString(),
                                          ),
                                          const LibraryVerticalDivider(),
                                          LibraryStatColumn(
                                            label: 'Following',
                                            value: profile.following.toString(),
                                          ),
                                          const LibraryVerticalDivider(),
                                          LibraryStatColumn(
                                            label: 'Likes',
                                            value: profile.totalLike.toString(),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                // Action Buttons
                                ProfileActionButtons(profile: profile),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Sticky TabBar
                  SliverOverlapAbsorber(
                    handle: NestedScrollView.sliverOverlapAbsorberHandleFor(
                      context,
                    ),
                    sliver: SliverPersistentHeader(
                      pinned: true,
                      delegate: _SliverAppBarDelegate(
                        TabBar(
                          labelColor: theme.colorScheme.onSurface,
                          unselectedLabelColor: theme.colorScheme.onSurface
                              .withValues(alpha: 0.6),
                          indicatorColor: theme.colorScheme.primary,
                          indicatorSize: TabBarIndicatorSize.tab,
                          tabs: isOwnProfile
                              ? const <Widget>[
                                  Tab(text: 'Posts'),
                                  Tab(text: 'Liked'),
                                  Tab(text: 'Purchased'),
                                ]
                              : const <Widget>[Tab(text: 'Posts')],
                        ),
                      ),
                    ),
                  ),
                ];
              },
              body: TabBarView(
                children: isOwnProfile
                    ? <Widget>[
                        ProfileTabContent(
                          provider: profileUserPostsPaginationProvider(
                            username,
                          ),
                          emptyMessage: 'No posts yet',
                        ),
                        LibraryTabContent(
                          provider: likedPostsPaginationProvider,
                          emptyMessage: 'No liked posts yet',
                        ),
                        LibraryTabContent(
                          provider: purchasedPostsPaginationProvider,
                          emptyMessage: 'No purchased posts yet',
                        ),
                      ]
                    : <Widget>[
                        ProfileTabContent(
                          provider: profileUserPostsPaginationProvider(
                            username,
                          ),
                          emptyMessage: 'No posts yet',
                        ),
                      ],
              ),
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (Object err, StackTrace stack) =>
            Center(child: Text('Error: $err')),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate(this._tabBar);

  final TabBar _tabBar;

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return ColoredBox(
      color: Theme.of(context).colorScheme.surface,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
