import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/connectivity_controller.dart';
import '../states/connectivity_state.dart';

final AutoDisposeStateNotifierProvider<
  ConnectivityController,
  ConnectivityState
>
connectivityControllerProvider =
    StateNotifierProvider.autoDispose<
      ConnectivityController,
      ConnectivityState
    >(ConnectivityController.new);
