import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/settings_controller.dart';

final AutoDisposeStateNotifierProvider<SettingsController, AsyncValue<void>>
settingsControllerProvider =
    StateNotifierProvider.autoDispose<SettingsController, AsyncValue<void>>((
      Ref ref,
    ) {
      return SettingsController(ref);
    });
