import 'package:json_annotation/json_annotation.dart';

import '../../domain/entities/wallet_entity.dart';

part 'wallet_model.g.dart';

@JsonSerializable()
class WalletModel extends WalletEntity {
  const WalletModel({
    super.id,
    required super.balance,
    super.userId,
    required super.totalSpent,
    required super.totalEarned,
    super.currency,
  });

  factory WalletModel.fromJson(Map<String, dynamic> json) =>
      _$WalletModelFromJson(json);

  Map<String, dynamic> toJson() => _$WalletModelToJson(this);
}

@JsonSerializable()
class TransactionModel extends TransactionEntity {
  const TransactionModel({
    required super.id,
    required super.amount,
    required super.type,
    required super.createdDate,
    required super.feeAmount,
    required super.feePercent,
    required super.netReceivedAmount,
    required super.balanceAfter,
    super.status,
    super.description,
    super.currency,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) =>
      _$TransactionModelFromJson(json);

  Map<String, dynamic> toJson() => _$TransactionModelToJson(this);
}

class TransactionListModel extends TransactionListEntity {
  const TransactionListModel({
    required List<TransactionModel> super.transactions,
    required super.totalPage,
  });

  factory TransactionListModel.fromJson(Map<String, dynamic> json) {
    return TransactionListModel(
      transactions:
          (json['walletTransactionResponseDtos'] as List<dynamic>?)
              ?.map(
                (dynamic e) =>
                    TransactionModel.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          <TransactionModel>[],
      totalPage: json['totalPage'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => <String, dynamic>{
    'walletTransactionResponseDtos': transactions
        .map((TransactionEntity e) => (e as TransactionModel).toJson())
        .toList(),
    'totalPage': totalPage,
  };
}
