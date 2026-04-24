import 'package:equatable/equatable.dart';

enum ConnectivityStatus { initial, checking, connected, disconnected }

class ConnectivityState extends Equatable {
  const ConnectivityState({
    this.isConnected = false,
    this.status = ConnectivityStatus.initial,
    this.errorMessage = '',
  });

  final bool isConnected;
  final ConnectivityStatus status;
  final String errorMessage;

  ConnectivityState copyWith({
    bool? isConnected,
    ConnectivityStatus? status,
    String? errorMessage,
  }) {
    return ConnectivityState(
      isConnected: isConnected ?? this.isConnected,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => <Object?>[isConnected, status, errorMessage];
}
