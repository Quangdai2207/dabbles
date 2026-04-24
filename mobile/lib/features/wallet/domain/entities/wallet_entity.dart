import 'package:equatable/equatable.dart';

class WalletEntity extends Equatable {
  const WalletEntity({
    this.id,
    required this.balance,
    this.userId,
    required this.totalSpent,
    required this.totalEarned,
    this.currency = 'USD',
  });

  final String? id;
  final double balance;
  final String? userId;
  final double totalSpent;
  final double totalEarned;
  final String currency;

  @override
  List<Object?> get props => <Object?>[
    id,
    balance,
    userId,
    totalSpent,
    totalEarned,
    currency,
  ];
}

class TransactionEntity extends Equatable {
  const TransactionEntity({
    required this.id,
    required this.amount,
    required this.type,
    required this.createdDate,
    required this.feeAmount,
    required this.feePercent,
    required this.netReceivedAmount,
    required this.balanceAfter,
    this.description,
    this.status, // Keeping status as optional just in case
    this.currency = 'USD',
  });

  final String id;
  final double amount;
  final String type; // e.g. deposit, withdrawal, payment
  final DateTime createdDate;
  final double feeAmount;
  final double feePercent;
  final double netReceivedAmount;
  final double balanceAfter;
  final String? description;
  final String? status;
  final String currency;

  @override
  List<Object?> get props => <Object?>[
    id,
    amount,
    type,
    createdDate,
    feeAmount,
    feePercent,
    netReceivedAmount,
    balanceAfter,
    description,
    status,
    currency,
  ];
}

class TransactionListEntity extends Equatable {
  const TransactionListEntity({
    required this.transactions,
    required this.totalPage,
  });

  final List<TransactionEntity> transactions;
  final int totalPage;

  @override
  List<Object?> get props => <Object?>[transactions, totalPage];
}
