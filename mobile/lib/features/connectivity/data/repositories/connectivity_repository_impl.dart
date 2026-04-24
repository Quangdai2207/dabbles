import '../../domain/entities/connectivity_entity.dart';
import '../../domain/repositories/connectivity_repository.dart';
import '../datasources/connectivity_datasource.dart';

class ConnectivityRepositoryImpl implements ConnectivityRepository {
  ConnectivityRepositoryImpl(this._datasource);
  final ConnectivityDatasource _datasource;

  @override
  Future<ConnectivityEntity> checkConnectivity() async {
    return await _datasource.checkConnectivity();
  }

  @override
  Stream<ConnectivityEntity> listenToConnectivityChanges() {
    return _datasource.listenToConnectivityChanges();
  }
}
