import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/injection/export_injection.dart';
import '../../../shared/constants/transaction_group.dart';
import '../controllers/balance_controller.dart';
import '../controllers/transaction_list_controller.dart';
import '../states/balance_state.dart';
import '../states/transaction_list_state.dart';

// Balance Controller
final StateNotifierProvider<BalanceController, BalanceState>
balanceControllerProvider =
    StateNotifierProvider<BalanceController, BalanceState>((Ref ref) {
      return BalanceController(ref.watch(getWalletUseCaseProvider));
    });

// Transaction List Controllers
final StateNotifierProvider<TransactionListController, TransactionListState>
walletFlowTransactionListProvider =
    StateNotifierProvider<TransactionListController, TransactionListState>((
      Ref ref,
    ) {
      return TransactionListController(
        ref.watch(getTransactionsUseCaseProvider),
        TransactionGroup.walletFlow,
      );
    });

final StateNotifierProvider<TransactionListController, TransactionListState>
purchaseTransactionListProvider =
    StateNotifierProvider<TransactionListController, TransactionListState>((
      Ref ref,
    ) {
      return TransactionListController(
        ref.watch(getTransactionsUseCaseProvider),
        TransactionGroup.purchase,
      );
    });

final StateNotifierProvider<TransactionListController, TransactionListState>
saleTransactionListProvider =
    StateNotifierProvider<TransactionListController, TransactionListState>((
      Ref ref,
    ) {
      return TransactionListController(
        ref.watch(getTransactionsUseCaseProvider),
        TransactionGroup.sale,
      );
    });
