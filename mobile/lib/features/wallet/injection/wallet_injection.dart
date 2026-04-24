import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/remote/wallet_remote_datasource.dart';
import '../data/repositories/wallet_repository_impl.dart';
import '../domain/repositories/wallet_repository.dart';
import '../domain/usecases/wallet_usecases.dart';

export '../domain/usecases/wallet_usecases.dart';

// Data Source
final Provider<WalletRemoteDataSource> walletRemoteDataSourceProvider =
    Provider<WalletRemoteDataSource>((Ref ref) {
      return WalletRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repository
final Provider<WalletRepository> walletRepositoryProvider =
    Provider<WalletRepository>((Ref ref) {
      return WalletRepositoryImpl(ref.watch(walletRemoteDataSourceProvider));
    });

// Use Cases
final Provider<GetWalletUseCase> getWalletUseCaseProvider =
    Provider<GetWalletUseCase>((Ref ref) {
      return GetWalletUseCase(ref.watch(walletRepositoryProvider));
    });

final Provider<GetTransactionsUseCase> getTransactionsUseCaseProvider =
    Provider<GetTransactionsUseCase>((Ref ref) {
      return GetTransactionsUseCase(ref.watch(walletRepositoryProvider));
    });

final Provider<CreateTransactionUseCase> createTransactionUseCaseProvider =
    Provider<CreateTransactionUseCase>((Ref ref) {
      return CreateTransactionUseCase(ref.watch(walletRepositoryProvider));
    });

final Provider<CreatePaypalPaymentUseCase> createPaypalPaymentUseCaseProvider =
    Provider<CreatePaypalPaymentUseCase>((Ref ref) {
      return CreatePaypalPaymentUseCase(ref.watch(walletRepositoryProvider));
    });

final Provider<ExecutePaypalPaymentUseCase>
executePaypalPaymentUseCaseProvider = Provider<ExecutePaypalPaymentUseCase>((
  Ref ref,
) {
  return ExecutePaypalPaymentUseCase(ref.watch(walletRepositoryProvider));
});

final Provider<WithdrawFundsUseCase> withdrawFundsUseCaseProvider =
    Provider<WithdrawFundsUseCase>((Ref ref) {
      return WithdrawFundsUseCase(ref.watch(walletRepositoryProvider));
    });
