import 'package:equatable/equatable.dart';

enum ConnectionType { wifi, mobile, ethernet, bluetooth, vpn, none, other }

class ConnectivityEntity extends Equatable {
  const ConnectivityEntity({
    required this.isConnected,
    required this.connectionType,
  });

  final bool isConnected;
  final ConnectionType connectionType;

  @override
  List<Object?> get props => <Object?>[isConnected, connectionType];
}
