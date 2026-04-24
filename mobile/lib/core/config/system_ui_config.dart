import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Manages system UI configurations like status bar and navigation bar
class SystemUIConfig {
  SystemUIConfig._();

  /// Configures the system UI overlay style
  static Future<void> configure() async {
    await SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
    );
  }
}
