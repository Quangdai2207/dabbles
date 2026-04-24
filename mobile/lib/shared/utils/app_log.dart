import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

/// Standardized printing utility using the logger package
class AppLog {
  AppLog._();

  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 8,
      lineLength: 80,
      colors: true,
      printEmojis: true,
      dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
    ),
  );

  static void info(Object? message) {
    if (kDebugMode) {
      _logger.i(message);
    }
  }

  static void error(Object? message, [dynamic error, StackTrace? stackTrace]) {
    if (kDebugMode) {
      _logger.e(message, error: error, stackTrace: stackTrace);
    }
  }

  static void warning(Object? message) {
    if (kDebugMode) {
      _logger.w(message);
    }
  }

  static void debug(Object? message) {
    if (kDebugMode) {
      _logger.d(message);
    }
  }
}
