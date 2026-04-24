import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/messenger/states/chat_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../presentation/auth/providers/user_provider.dart';
import '../../../presentation/commons/providers/navigation_provider.dart';
import '../../../presentation/create/screens/create_screen.dart';
import '../../../presentation/home/screens/home_screen.dart';
import '../../../presentation/library/screens/library_screen.dart';
import '../../../presentation/messenger/controllers/conversation_controller.dart';
import '../../../presentation/messenger/screens/messenger_screen.dart';
import '../../../presentation/search/screens/search_screen.dart';
import '../../../shared/widgets/layouts/widgets/user_profile_menu.dart';
import '../../../shared/widgets/ui/d_logo.dart';
import '../../notification/providers/notification_provider.dart';
import '../../notification/states/notification_state.dart';
import '../../notification/widgets/notification_sheet.dart';

class MainLayout extends ConsumerStatefulWidget {
  const MainLayout({super.key});

  @override
  ConsumerState<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends ConsumerState<MainLayout> {
  final List<Widget> _screens = <Widget>[
    HomeScreen(),
    SearchScreen(),
    CreateScreen(),
    LibraryScreen(),
    MessengerScreen(),
  ];

  @override
  void initState() {
    super.initState();
    // Initial fetch of notifications
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final NotificationListState state = ref.read(notificationListProvider);
      if (state.notifications.isEmpty) {
        ref
            .read(notificationListProvider.notifier)
            .fetchNotifications(refresh: true);
      }
      // Init conversation socket
      ref.read(conversationControllerProvider.notifier).init();
    });
  }

  void _onItemTapped(int index) {
    ref.read(mainNavIndexProvider.notifier).state = index;
  }

  void _onPopInvoked(bool didPop, dynamic result) {
    if (didPop) return;
    final int currentIndex = ref.read(mainNavIndexProvider);
    if (currentIndex != 0) {
      ref.read(mainNavIndexProvider.notifier).state = 0;
    } else {
      SystemNavigator.pop();
    }
  }

  void _showNotifications() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      builder: (BuildContext context) {
        return const NotificationSheet();
      },
    );
  }

  String _getAppBarTitle(int index) {
    switch (index) {
      case 0:
        return 'Dabble';
      case 1:
        return 'Search';
      case 2:
        return 'Create Post';
      case 3:
        return 'Your library';
      case 4:
        return 'Messages';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final int currentIndex = ref.watch(mainNavIndexProvider);
    // Watch user profile
    final AsyncValue<ProfileEntity?> userAsync = ref.watch(currentUserProvider);

    // Initialize socket
    ref.watch(notificationSocketProvider);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: _onPopInvoked,
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          centerTitle: false,
          elevation: 0,
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          surfaceTintColor: Colors.transparent,
          title: Row(
            children: <Widget>[
              const DLogo(width: 28, height: 28),
              const SizedBox(width: 10),
              Text(
                _getAppBarTitle(currentIndex),
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          actions: <Widget>[
            Consumer(
              builder: (BuildContext context, WidgetRef ref, Widget? child) {
                final int count = ref.watch(notificationCountProvider);
                return IconButton(
                  onPressed: _showNotifications,
                  icon: Badge(
                    offset: const Offset(10, -10),
                    label: Text('$count'),
                    isLabelVisible: count > 0,
                    child: const Icon(LucideIcons.bell),
                  ),
                );
              },
            ),
            const SizedBox(width: 12),
            userAsync.when(
              data: (ProfileEntity? user) {
                if (user != null) {
                  return UserProfileMenu(user: user);
                }
                return const SizedBox.shrink();
              },
              loading: () => const Padding(
                padding: EdgeInsets.only(right: 16.0),
                child: SizedBox(
                  width: 32,
                  height: 32,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
              error: (_, _) => const Padding(
                padding: EdgeInsets.only(right: 16.0),
                child: CircleAvatar(
                  radius: 16,
                  child: Icon(LucideIcons.circleAlert),
                ),
              ),
            ),
          ],
        ),
        body: IndexedStack(index: currentIndex, children: _screens),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: _onItemTapped,
          type: BottomNavigationBarType.fixed,
          showSelectedLabels: false,
          showUnselectedLabels: false,
          items: <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.house),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.search),
              label: 'Search',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.squarePlus),
              label: 'Create',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.library),
              label: 'Library',
            ),
            BottomNavigationBarItem(
              icon: Consumer(
                builder: (BuildContext context, WidgetRef ref, Widget? child) {
                  final int unreadCount = ref.watch(
                    conversationControllerProvider.select(
                      (ConversationState s) => s.totalUnreadCount,
                    ),
                  );

                  return Badge(
                    label: Text('$unreadCount'),
                    isLabelVisible: unreadCount > 0,
                    child: const Icon(LucideIcons.messageCircleMore),
                  );
                },
              ),
              label: 'Messenger',
            ),
          ],
        ),
      ),
    );
  }
}
