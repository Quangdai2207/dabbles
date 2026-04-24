import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Environment configuration helper
class Env {
  Env._();

  /// Load environment variables from .env file
  /// Call this in main() before runApp()
  static Future<void> load() async {
    await dotenv.load(fileName: '.env');
  }

  // ==================== App Config ====================

  static String get appName => dotenv.env['APP_NAME'] ?? 'Dabble';

  static String get appEnv => dotenv.env['APP_ENV'] ?? 'development';

  static bool get isDevelopment => appEnv == 'development';

  static bool get isProduction => appEnv == 'production';

  static bool get isStaging => appEnv == 'staging';

  // ==================== API Config ====================

  static String get apiBaseUrl => dotenv.env['API_BASE_URL'] ?? '';
  static String get wsBaseUrl => dotenv.env['WS_BASE_URL'] ?? '';
  static String get imageBaseUrl => dotenv.env['IMAGE_BASE_URL'] ?? '';

  static int get apiTimeout =>
      int.tryParse(dotenv.env['API_TIMEOUT'] ?? '30000') ?? 30000;

  // ==================== Feature Flags ====================

  static bool get enableAnalytics =>
      dotenv.env['ENABLE_ANALYTICS']?.toLowerCase() == 'true';

  static bool get enableCrashReporting =>
      dotenv.env['ENABLE_CRASH_REPORTING']?.toLowerCase() == 'true';

  // ==================== Third Party Config ====================

  static String get turnstileSiteKey => dotenv.env['TURNSTILE_SITE_KEY'] ?? '';

  static String get googleClientId => dotenv.env['GOOGLE_CLIENT_ID'] ?? '';

  // ==================== Validation ====================

  /// Validates that all required environment variables are set
  /// Throws an error with helpful message if any required variable is missing
}
