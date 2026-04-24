import '../../../../core/network/api_response.dart';
import '../entities/wallet_entity.dart';
import '../repositories/wallet_repository.dart';

class GetWalletUseCase {
  GetWalletUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseObject<WalletEntity>> call() {
    return _repository.getWallet();
  }
}

class GetTransactionsUseCase {
  GetTransactionsUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseObject<TransactionListEntity>> call({
    required int page,
    required String group,
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  }) {
    return _repository.getTransactions(
      page: page,
      group: group,
      sortByPriceDesc: sortByPriceDesc,
      sortByCreatedDateDesc: sortByCreatedDateDesc,
      fromDate: fromDate,
      toDate: toDate,
    );
  }
}

class CreateTransactionUseCase {
  CreateTransactionUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseStatus> call({
    required double amount,
    required String type,
    String? description,
  }) {
    return _repository.createTransaction(
      amount: amount,
      type: type,
      description: description,
    );
  }
}

class CreatePaypalPaymentUseCase {
  CreatePaypalPaymentUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseObject<String>> call(double amount) {
    return _repository.createPaypalPayment(amount);
  }
}

class ExecutePaypalPaymentUseCase {
  ExecutePaypalPaymentUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseStatus> call(String paymentId, String payerId) {
    return _repository.executePaypalPayment(paymentId, payerId);
  }
}

class WithdrawFundsUseCase {
  WithdrawFundsUseCase(this._repository);
  final WalletRepository _repository;

  Future<ApiResponseStatus> call({
    required double amount,
    String? description,
  }) {
    return _repository.withdrawFunds(amount: amount, description: description);
  }
}
