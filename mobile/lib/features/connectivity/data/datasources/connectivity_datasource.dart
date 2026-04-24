import 'package:connectivity_plus/connectivity_plus.dart';
import '../../domain/entities/connectivity_entity.dart';

class ConnectivityDatasource {
  ConnectivityDatasource(this._connectivity);
  final Connectivity _connectivity;

  Future<ConnectivityEntity> checkConnectivity() async {
    final List<ConnectivityResult> results = await _connectivity
        .checkConnectivity();

    return _mapToEntity(results);
  }

  Stream<ConnectivityEntity> listenToConnectivityChanges() {
    return _connectivity.onConnectivityChanged.map(_mapToEntity);
  }

  ConnectivityEntity _mapToEntity(List<ConnectivityResult> results) {
    if (results.isEmpty || results.contains(ConnectivityResult.none)) {
      return const ConnectivityEntity(
        isConnected: false,
        connectionType: ConnectionType.none,
      );
    }

    // Get the first non-none result
    final ConnectivityResult result = results.firstWhere(
      (ConnectivityResult r) => r != ConnectivityResult.none,
      orElse: () => ConnectivityResult.none,
    );

    final ConnectionType type = _mapConnectionType(result);
    final bool isConnected = result != ConnectivityResult.none;

    return ConnectivityEntity(isConnected: isConnected, connectionType: type);
  }

  ConnectionType _mapConnectionType(ConnectivityResult result) {
    switch (result) {
      case ConnectivityResult.wifi:
        return ConnectionType.wifi;
      case ConnectivityResult.mobile:
        return ConnectionType.mobile;
      case ConnectivityResult.ethernet:
        return ConnectionType.ethernet;
      case ConnectivityResult.bluetooth:
        return ConnectionType.bluetooth;
      case ConnectivityResult.vpn:
        return ConnectionType.vpn;
      case ConnectivityResult.none:
        return ConnectionType.none;
      case ConnectivityResult.other:
        return ConnectionType.other;
    }
  }
}
