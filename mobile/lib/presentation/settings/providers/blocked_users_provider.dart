import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/blocked_users_controller.dart';
import '../states/blocked_users_state.dart';

final AutoDisposeStateNotifierProvider<
  BlockedUsersController,
  BlockedUsersState
>
blockedUsersControllerProvider =
    StateNotifierProvider.autoDispose<
      BlockedUsersController,
      BlockedUsersState
    >(BlockedUsersController.new);
