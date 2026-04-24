import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/datasources/connectivity_datasource.dart';
import '../data/repositories/connectivity_repository_impl.dart';
import '../domain/repositories/connectivity_repository.dart';
import '../domain/usecases/check_connectivity_usecase.dart';

// Connectivity instance
final Provider<Connectivity> connectivityProvider = Provider<Connectivity>(
  (Ref ref) => Connectivity(),
);

// Datasource
final Provider<ConnectivityDatasource> connectivityDatasourceProvider =
    Provider<ConnectivityDatasource>((Ref ref) {
      return ConnectivityDatasource(ref.watch(connectivityProvider));
    });

// Repository
final Provider<ConnectivityRepository> connectivityRepositoryProvider =
    Provider<ConnectivityRepository>((Ref ref) {
      return ConnectivityRepositoryImpl(
        ref.watch(connectivityDatasourceProvider),
      );
    });

// Use Cases
final Provider<CheckConnectivityUseCase> checkConnectivityUseCaseProvider =
    Provider<CheckConnectivityUseCase>((Ref ref) {
      return CheckConnectivityUseCase(
        ref.watch(connectivityRepositoryProvider),
      );
    });
