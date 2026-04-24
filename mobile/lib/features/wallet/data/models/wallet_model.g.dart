// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'wallet_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WalletModel _$WalletModelFromJson(Map<String, dynamic> json) => $checkedCreate(
  'WalletModel',
  json,
  ($checkedConvert) {
    final val = WalletModel(
      id: $checkedConvert('id', (v) => v as String?),
      balance: $checkedConvert('balance', (v) => (v as num).toDouble()),
      userId: $checkedConvert('userId', (v) => v as String?),
      totalSpent: $checkedConvert('totalSpent', (v) => (v as num).toDouble()),
      totalEarned: $checkedConvert('totalEarned', (v) => (v as num).toDouble()),
      currency: $checkedConvert('currency', (v) => v as String? ?? 'USD'),
    );
    return val;
  },
);

Map<String, dynamic> _$WalletModelToJson(WalletModel instance) =>
    <String, dynamic>{
      'id': ?instance.id,
      'balance': instance.balance,
      'userId': ?instance.userId,
      'totalSpent': instance.totalSpent,
      'totalEarned': instance.totalEarned,
      'currency': instance.currency,
    };

TransactionModel _$TransactionModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TransactionModel', json, ($checkedConvert) {
      final val = TransactionModel(
        id: $checkedConvert('id', (v) => v as String),
        amount: $checkedConvert('amount', (v) => (v as num).toDouble()),
        type: $checkedConvert('type', (v) => v as String),
        createdDate: $checkedConvert(
          'createdDate',
          (v) => DateTime.parse(v as String),
        ),
        feeAmount: $checkedConvert('feeAmount', (v) => (v as num).toDouble()),
        feePercent: $checkedConvert('feePercent', (v) => (v as num).toDouble()),
        netReceivedAmount: $checkedConvert(
          'netReceivedAmount',
          (v) => (v as num).toDouble(),
        ),
        balanceAfter: $checkedConvert(
          'balanceAfter',
          (v) => (v as num).toDouble(),
        ),
        status: $checkedConvert('status', (v) => v as String?),
        description: $checkedConvert('description', (v) => v as String?),
        currency: $checkedConvert('currency', (v) => v as String? ?? 'USD'),
      );
      return val;
    });

Map<String, dynamic> _$TransactionModelToJson(TransactionModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'amount': instance.amount,
      'type': instance.type,
      'createdDate': instance.createdDate.toIso8601String(),
      'feeAmount': instance.feeAmount,
      'feePercent': instance.feePercent,
      'netReceivedAmount': instance.netReceivedAmount,
      'balanceAfter': instance.balanceAfter,
      'description': ?instance.description,
      'status': ?instance.status,
      'currency': instance.currency,
    };
