import 'package:dabble/core/network/socket_service.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:dabble/presentation/balance/providers/balance_providers.dart';
import 'package:dabble/presentation/commons/providers/navigation_provider.dart';
import 'package:dabble/presentation/home/providers/home_feed_provider.dart';
import 'package:dabble/presentation/library/providers/library_pagination_providers.dart';
import 'package:dabble/presentation/library/providers/library_providers.dart';
import 'package:dabble/presentation/messenger/controllers/conversation_controller.dart';
import 'package:dabble/presentation/notification/providers/notification_provider.dart';
import 'package:dabble/presentation/search/providers/search_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SessionUtils {
  static void invalidateUserSession(Ref ref) {
    // 1. Disconnect socket first
    SocketService().disconnect();

    // 2. Invalidate Authentication & User Data
    ref.invalidate(authTokenProvider);
    ref.invalidate(currentUserProvider);
    ref.invalidate(authProfileProvider);

    // 3. Invalidate Navigation & UI State
    ref.invalidate(mainNavIndexProvider);

    // 4. Invalidate Features
    // Notifications
    ref.invalidate(notificationListProvider);
    ref.invalidate(notificationCountProvider);

    // Messenger
    ref.invalidate(conversationControllerProvider);

    // Library
    ref.invalidate(libraryControllerProvider);
    ref.invalidate(userPostsPaginationProvider);
    ref.invalidate(likedPostsPaginationProvider);
    ref.invalidate(purchasedPostsPaginationProvider);

    // Home
    ref.invalidate(homeFeedProvider);

    // Search
    ref.invalidate(searchProvider);

    // Balance & Transactions
    ref.invalidate(balanceControllerProvider);
    ref.invalidate(walletFlowTransactionListProvider);
    ref.invalidate(purchaseTransactionListProvider);
    ref.invalidate(saleTransactionListProvider);
  }
}
