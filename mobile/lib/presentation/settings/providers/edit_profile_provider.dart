import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/edit_profile_controller.dart';
import '../states/edit_profile_state.dart';

final AutoDisposeStateNotifierProvider<EditProfileController, EditProfileState>
editProfileControllerProvider =
    StateNotifierProvider.autoDispose<EditProfileController, EditProfileState>(
      EditProfileController.new,
    );
