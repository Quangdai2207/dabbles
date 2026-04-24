import '../../../../core/network/api_response.dart';
import '../../domain/entities/wallet_entity.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../datasources/remote/wallet_remote_datasource.dart';
import '../models/wallet_model.dart';

class WalletRepositoryImpl implements WalletRepository {
  WalletRepositoryImpl(this._remoteDataSource);
  final WalletRemoteDataSource _remoteDataSource;

  @override
  Future<ApiResponseObject<String>> createPaypalPayment(double amount) {
    return _remoteDataSource.createPaypalPayment(amount);
  }

  @override
  Future<ApiResponseStatus> createTransaction({
    required double amount,
    required String type,
    String? description,
  }) {
    return _remoteDataSource.createTransaction(
      amount: amount,
      type: type,
      description: description,
    );
  }

  @override
  Future<ApiResponseStatus> executePaypalPayment(
    String paymentId,
    String payerId,
  ) {
    return _remoteDataSource.executePaypalPayment(paymentId, payerId);
  }

  @override
  Future<ApiResponseObject<TransactionListEntity>> getTransactions({
    required int page,
    required String group,
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  }) async {
    final ApiResponseObject<TransactionListModel> response =
        await _remoteDataSource.getTransactions(
          page: page,
          group: group,
          sortByPriceDesc: sortByPriceDesc,
          sortByCreatedDateDesc: sortByCreatedDateDesc,
          fromDate: fromDate,
          toDate: toDate,
        );

    if (response.isSuccess) {
      return ApiResponseObject<TransactionListEntity>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<TransactionListEntity>.error(
      response.errorMessage,
    );
  }

  @override
  Future<ApiResponseObject<WalletEntity>> getWallet() async {
    final ApiResponseObject<WalletModel> response = await _remoteDataSource
        .getWallet();

    if (response.isSuccess) {
      return ApiResponseObject<WalletEntity>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<WalletEntity>.error(response.errorMessage);
  }

  @override
  Future<ApiResponseStatus> withdrawFunds({
    required double amount,
    String? description,
  }) {
    return _remoteDataSource.withdrawFunds(
      amount: amount,
      description: description,
    );
  }
}
