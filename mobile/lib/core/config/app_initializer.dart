import 'package:flutter_displaymode/flutter_displaymode.dart';

import '../network/api_client.dart';
import 'env.dart';
import 'system_ui_config.dart';

/// Handles all app initialization tasks
class AppInitializer {
  AppInitializer._();

  /// Initializes all app configurations and services
  static Future<void> initialize() async {
    await Future.wait(<Future<void>>[
      _configureDisplayMode(),
      SystemUIConfig.configure(),
      _initializeServices(),
    ]);
  }

  /// Configures high refresh rate display
  static Future<void> _configureDisplayMode() async {
    await FlutterDisplayMode.setHighRefreshRate();
  }

  /// Initializes core app services
  static Future<void> _initializeServices() async {
    await Env.load();
    ApiClient.instance.init();
  }
}
