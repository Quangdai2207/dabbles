import 'package:equatable/equatable.dart';

import '../../../features/wallet/domain/entities/wallet_entity.dart';

enum TransactionListStatus { initial, loading, loadingMore, success, error }

class TransactionListState extends Equatable {
  const TransactionListState({
    this.status = TransactionListStatus.initial,
    this.transactions = const <TransactionEntity>[],
    this.currentPage = 0,
    this.totalPages = 0,
    this.hasMore = true,
    this.errorMessage,
  });

  final TransactionListStatus status;
  final List<TransactionEntity> transactions;
  final int currentPage;
  final int totalPages;
  final bool hasMore;
  final String? errorMessage;

  TransactionListState copyWith({
    TransactionListStatus? status,
    List<TransactionEntity>? transactions,
    int? currentPage,
    int? totalPages,
    bool? hasMore,
    String? errorMessage,
  }) {
    return TransactionListState(
      status: status ?? this.status,
      transactions: transactions ?? this.transactions,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasMore: hasMore ?? this.hasMore,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[
    status,
    transactions,
    currentPage,
    totalPages,
    hasMore,
    errorMessage,
  ];
}
