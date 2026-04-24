import 'package:equatable/equatable.dart';

import '../../../features/wallet/domain/entities/wallet_entity.dart';

enum BalanceStatus { initial, loading, success, error }

class BalanceState extends Equatable {
  const BalanceState({
    this.status = BalanceStatus.initial,
    this.wallet,
    this.errorMessage,
  });

  final BalanceStatus status;
  final WalletEntity? wallet;
  final String? errorMessage;

  BalanceState copyWith({
    BalanceStatus? status,
    WalletEntity? wallet,
    String? errorMessage,
  }) {
    return BalanceState(
      status: status ?? this.status,
      wallet: wallet ?? this.wallet,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[status, wallet, errorMessage];
}
