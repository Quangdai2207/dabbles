import '../entities/connectivity_entity.dart';

abstract class ConnectivityRepository {
  Future<ConnectivityEntity> checkConnectivity();
  Stream<ConnectivityEntity> listenToConnectivityChanges();
}
