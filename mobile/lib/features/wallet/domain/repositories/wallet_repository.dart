import '../../../../core/network/api_response.dart';
import '../entities/wallet_entity.dart';

abstract class WalletRepository {
  Future<ApiResponseObject<WalletEntity>> getWallet();
  Future<ApiResponseObject<TransactionListEntity>> getTransactions({
    required int page,
    required String group,
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  });
  Future<ApiResponseStatus> createTransaction({
    required double amount,
    required String type,
    String? description,
  });
  Future<ApiResponseObject<String>> createPaypalPayment(double amount);
  Future<ApiResponseStatus> executePaypalPayment(
    String paymentId,
    String payerId,
  );
  Future<ApiResponseStatus> withdrawFunds({
    required double amount,
    String? description,
  });
}
