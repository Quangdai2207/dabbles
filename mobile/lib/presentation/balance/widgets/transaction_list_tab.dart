import 'package:dabble/features/wallet/domain/entities/wallet_entity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../controllers/transaction_list_controller.dart';
import '../providers/balance_providers.dart';
import '../states/transaction_list_state.dart';
import 'transaction_item.dart';

class TransactionListTab extends ConsumerStatefulWidget {
  const TransactionListTab({
    this.isWalletFlow = false,
    this.isPurchase = false,
    this.isSale = false,
    super.key,
  });

  final bool isWalletFlow;
  final bool isPurchase;
  final bool isSale;

  @override
  ConsumerState<TransactionListTab> createState() => _TransactionListTabState();
}

class _TransactionListTabState extends ConsumerState<TransactionListTab> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    // Fetch initial data only if empty
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final TransactionListState state = ref.read(_getProvider());
      if (state.transactions.isEmpty &&
          state.status != TransactionListStatus.loading) {
        ref.read(_getProvider().notifier).fetchTransactions(refresh: true);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  StateNotifierProvider<TransactionListController, TransactionListState>
  _getProvider() {
    if (widget.isWalletFlow) {
      return walletFlowTransactionListProvider;
    } else if (widget.isPurchase) {
      return purchaseTransactionListProvider;
    } else {
      return saleTransactionListProvider;
    }
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      final TransactionListState state = ref.read(_getProvider());
      if (state.hasMore &&
          state.status != TransactionListStatus.loading &&
          state.status != TransactionListStatus.loadingMore) {
        ref.read(_getProvider().notifier).fetchTransactions();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final TransactionListState state = ref.watch(_getProvider());

    if (state.status == TransactionListStatus.loading &&
        state.transactions.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.status == TransactionListStatus.error &&
        state.transactions.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(
                LucideIcons.circleAlert,
                size: 48,
                color: Theme.of(context).colorScheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                state.errorMessage ?? 'Failed to load transactions',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  ref
                      .read(_getProvider().notifier)
                      .fetchTransactions(refresh: true);
                },
                icon: const Icon(LucideIcons.refreshCw, size: 18),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (state.transactions.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(
                LucideIcons.inbox,
                size: 64,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              const SizedBox(height: 16),
              Text(
                'No transactions found',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        await ref
            .read(_getProvider().notifier)
            .fetchTransactions(refresh: true);
      },
      child: ListView.separated(
        controller: _scrollController,
        padding: const EdgeInsets.all(16.0),
        itemCount:
            state.transactions.length +
            (state.status == TransactionListStatus.loadingMore ? 1 : 0),
        separatorBuilder: (BuildContext context, int index) =>
            const SizedBox(height: 8),
        itemBuilder: (BuildContext context, int index) {
          if (index >= state.transactions.length) {
            return const Padding(
              padding: EdgeInsets.all(16.0),
              child: Center(child: CircularProgressIndicator()),
            );
          }

          final TransactionEntity transaction = state.transactions[index];
          return TransactionItem(transaction: transaction);
        },
      ),
    );
  }
}
