import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/register_controller.dart';
import '../states/register_state.dart';

final AutoDisposeStateNotifierProvider<RegisterController, RegisterState>
registerControllerProvider =
    StateNotifierProvider.autoDispose<RegisterController, RegisterState>(
      RegisterController.new,
    );
