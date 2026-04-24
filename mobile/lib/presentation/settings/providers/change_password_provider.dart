import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/change_password_controller.dart';
import '../states/change_password_state.dart';

final AutoDisposeStateNotifierProvider<
  ChangePasswordController,
  ChangePasswordState
>
changePasswordControllerProvider =
    StateNotifierProvider.autoDispose<
      ChangePasswordController,
      ChangePasswordState
    >(ChangePasswordController.new);
