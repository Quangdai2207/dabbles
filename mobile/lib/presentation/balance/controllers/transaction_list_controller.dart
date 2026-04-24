import 'package:dabble/core/network/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/injection/export_injection.dart';
import '../../../features/wallet/domain/entities/wallet_entity.dart';
import '../states/transaction_list_state.dart';

class TransactionListController extends StateNotifier<TransactionListState> {
  TransactionListController(this._getTransactionsUseCase, this._group)
    : super(const TransactionListState());

  final GetTransactionsUseCase _getTransactionsUseCase;
  final String _group;

  // Filters
  bool? _sortByPriceDesc;
  bool? _sortByCreatedDateDesc;
  String? _fromDate;
  String? _toDate;

  Future<void> fetchTransactions({bool refresh = false}) async {
    if (refresh) {
      state = const TransactionListState();
    }

    if (state.status == TransactionListStatus.loading ||
        state.status == TransactionListStatus.loadingMore) {
      return;
    }

    if (!refresh && !state.hasMore) {
      return;
    }

    state = state.copyWith(
      status: refresh || state.transactions.isEmpty
          ? TransactionListStatus.loading
          : TransactionListStatus.loadingMore,
    );

    final int page = refresh ? 0 : state.currentPage + 1;

    final ApiResponseObject<TransactionListEntity> response =
        await _getTransactionsUseCase.call(
          page: page,
          group: _group,
          sortByPriceDesc: _sortByPriceDesc,
          sortByCreatedDateDesc: _sortByCreatedDateDesc,
          fromDate: _fromDate,
          toDate: _toDate,
        );

    if (response.isSuccess && response.data != null) {
      final List<TransactionEntity> newTransactions =
          response.data!.transactions;
      final int totalPages = response.data!.totalPage;

      state = state.copyWith(
        status: TransactionListStatus.success,
        transactions: refresh
            ? newTransactions
            : <TransactionEntity>[...state.transactions, ...newTransactions],
        currentPage: page,
        totalPages: totalPages,
        hasMore: page < totalPages - 1,
      );
    } else {
      state = state.copyWith(
        status: TransactionListStatus.error,
        errorMessage: response.errorMessage,
      );
    }
  }

  void setFilters({
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  }) {
    _sortByPriceDesc = sortByPriceDesc;
    _sortByCreatedDateDesc = sortByCreatedDateDesc;
    _fromDate = fromDate;
    _toDate = toDate;
  }

  Future<void> applyFilters({
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  }) async {
    setFilters(
      sortByPriceDesc: sortByPriceDesc,
      sortByCreatedDateDesc: sortByCreatedDateDesc,
      fromDate: fromDate,
      toDate: toDate,
    );
    await fetchTransactions(refresh: true);
  }

  void reset() {
    state = const TransactionListState();
    _sortByPriceDesc = null;
    _sortByCreatedDateDesc = null;
    _fromDate = null;
    _toDate = null;
  }
}
