import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/login_controller.dart';
import '../states/login_state.dart';

final AutoDisposeStateNotifierProvider<LoginController, LoginState>
loginControllerProvider =
    StateNotifierProvider.autoDispose<LoginController, LoginState>(
      LoginController.new,
    );
