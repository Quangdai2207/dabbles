import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/ui/common_app_bar.dart';
import '../providers/balance_providers.dart';
import '../states/balance_state.dart';
import '../widgets/balance_overview_card.dart';
import '../widgets/transaction_list_tab.dart';

class BalanceScreen extends ConsumerStatefulWidget {
  const BalanceScreen({super.key});

  @override
  ConsumerState<BalanceScreen> createState() => _BalanceScreenState();
}

class _BalanceScreenState extends ConsumerState<BalanceScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Fetch wallet data on init only if empty
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final BalanceState state = ref.read(balanceControllerProvider);
      if (state.wallet == null && state.status != BalanceStatus.loading) {
        ref.read(balanceControllerProvider.notifier).fetchWallet();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final BalanceState balanceState = ref.watch(balanceControllerProvider);

    return Scaffold(
      appBar: const CommonAppBar(title: 'My Balance'),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(balanceControllerProvider.notifier).fetchWallet();
        },
        child: CustomScrollView(
          slivers: <Widget>[
            // Balance Overview
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: BalanceOverviewCard(
                  balanceState: balanceState,
                  onRefresh: () {
                    ref.read(balanceControllerProvider.notifier).fetchWallet();
                  },
                ),
              ),
            ),

            // Tab Bar
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  tabs: const <Widget>[
                    Tab(text: 'Transactions'),
                    Tab(text: 'Purchases'),
                    Tab(text: 'Sales'),
                  ],
                ),
              ),
            ),

            // Tab Content
            SliverFillRemaining(
              child: TabBarView(
                controller: _tabController,
                children: const <Widget>[
                  TransactionListTab(isWalletFlow: true),
                  TransactionListTab(isPurchase: true),
                  TransactionListTab(isSale: true),
                ],
              ),
            ),
          ],
        ),
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
      color: Theme.of(context).scaffoldBackgroundColor,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
