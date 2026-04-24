import 'package:dabble/core/network/api_response.dart';
import 'package:dabble/features/wallet/domain/entities/wallet_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/injection/export_injection.dart';
import '../states/balance_state.dart';

class BalanceController extends StateNotifier<BalanceState> {
  BalanceController(this._getWalletUseCase) : super(const BalanceState());

  final GetWalletUseCase _getWalletUseCase;

  Future<void> fetchWallet() async {
    state = state.copyWith(status: BalanceStatus.loading);

    final ApiResponseObject<WalletEntity> response = await _getWalletUseCase
        .call();

    if (response.isSuccess && response.data != null) {
      state = state.copyWith(
        status: BalanceStatus.success,
        wallet: response.data,
      );
    } else {
      state = state.copyWith(
        status: BalanceStatus.error,
        errorMessage: response.errorMessage,
      );
    }
  }

  void reset() {
    state = const BalanceState();
  }
}
