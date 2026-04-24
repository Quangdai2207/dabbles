import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/injection/export_injection.dart';
import '../../../features/connectivity/domain/entities/connectivity_entity.dart';
import '../../../shared/utils/app_log.dart';
import '../states/connectivity_state.dart';

class ConnectivityController extends StateNotifier<ConnectivityState> {
  ConnectivityController(this._ref) : super(const ConnectivityState());
  final Ref _ref;

  Future<void> checkConnectivity() async {
    state = state.copyWith(status: ConnectivityStatus.checking);

    try {
      final ConnectivityEntity result = await _ref
          .read(checkConnectivityUseCaseProvider)
          .call();

      state = state.copyWith(
        isConnected: result.isConnected,
        status: result.isConnected
            ? ConnectivityStatus.connected
            : ConnectivityStatus.disconnected,
      );
    } catch (e) {
      AppLog.error('Failed to check connectivity: $e');
      state = state.copyWith(
        status: ConnectivityStatus.disconnected,
        errorMessage: e.toString(),
        isConnected: false,
      );
    }
  }

  Future<void> refreshConnectivity() async {
    await checkConnectivity();
  }
}
