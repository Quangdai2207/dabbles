import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/wallet_model.dart';

class WalletRemoteDataSource {
  WalletRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<WalletModel>> getWallet() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.walletGet);

      return ApiResponseObject<WalletModel>.fromJson(
        response.data!,
        (Object? json) => WalletModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      return ApiResponseObject<WalletModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get wallet failed',
      );
    }
  }

  Future<ApiResponseObject<TransactionListModel>> getTransactions({
    required int page,
    required String group,
    bool? sortByPriceDesc,
    bool? sortByCreatedDateDesc,
    String? fromDate,
    String? toDate,
  }) async {
    try {
      final Map<String, dynamic> queryParameters = <String, dynamic>{
        'page': page,
        'group': group,
      };

      if (sortByPriceDesc != null) {
        queryParameters['sortByPriceDesc'] = sortByPriceDesc;
      }
      if (sortByCreatedDateDesc != null) {
        queryParameters['sortByCreatedDateDesc'] = sortByCreatedDateDesc;
      }
      if (fromDate != null) {
        queryParameters['fromDate'] = fromDate;
      }
      if (toDate != null) {
        queryParameters['toDate'] = toDate;
      }

      final Response<Map<String, dynamic>> response = await _apiClient.get(
        ApiEndpoints.transactionGetAll,
        queryParameters: queryParameters,
      );

      // Parse response according to TTransactionDto structure
      final Map<String, dynamic> data =
          response.data?['data'] as Map<String, dynamic>? ??
          <String, dynamic>{};
      final List<dynamic> transactionList =
          data['walletTransactionResponseDtos'] as List<dynamic>? ??
          <dynamic>[];
      final int totalPage = data['totalPage'] as int? ?? 0;

      final List<TransactionModel> transactions = transactionList
          .map(
            (dynamic e) => TransactionModel.fromJson(e as Map<String, dynamic>),
          )
          .toList();

      return ApiResponseObject<TransactionListModel>(
        isSuccess: true,
        data: TransactionListModel(
          transactions: transactions,
          totalPage: totalPage,
        ),
      );
    } on DioException catch (e) {
      return ApiResponseObject<TransactionListModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get transactions failed',
      );
    }
  }

  Future<ApiResponseStatus> createTransaction({
    required double amount,
    required String type,
    String? description,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.transactionCreate,
        data: <String, dynamic>{
          'amount': amount,
          'type': type,
          'description': description,
        },
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Create transaction failed',
      );
    }
  }

  Future<ApiResponseObject<String>> createPaypalPayment(double amount) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.paypalCreate,
        queryParameters: <String, dynamic>{'amount': amount},
      );

      // Assuming response.data['data'] is the approval URL or ID
      // Adjust based on actual API response for Paypal
      final String? paymentUrl =
          (response.data?['data'] as Map<String, dynamic>?)?['approvalUrl']
              as String?; // Example path

      if (paymentUrl != null) {
        return ApiResponseObject<String>(isSuccess: true, data: paymentUrl);
      }
      // Or return the whole data as string if needed
      return ApiResponseObject<String>(
        isSuccess: true,
        data: (response.data?['message'] as String?) ?? 'Success',
      );
    } on DioException catch (e) {
      return ApiResponseObject<String>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Create paypal payment failed',
      );
    }
  }

  Future<ApiResponseStatus> executePaypalPayment(
    String paymentId,
    String payerId,
  ) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.paypalExecute,
        queryParameters: <String, dynamic>{
          'paymentId': paymentId,
          'PayerID': payerId, // Paypal case sensitivity
        },
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Execute paypal payment failed',
      );
    }
  }

  Future<ApiResponseStatus> withdrawFunds({
    required double amount,
    String? description,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.transactionCreate,
        data: <String, dynamic>{
          'amount': amount,
          'type': 'WITHDRAWAL',
          'description': description,
        },
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Withdraw funds failed',
      );
    }
  }
}
