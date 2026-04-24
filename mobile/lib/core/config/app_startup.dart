import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:dabble/features/connectivity/domain/entities/connectivity_entity.dart';
import 'package:dabble/features/connectivity/injection/connectivity_injection.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../routing/routes.dart';

/// Handles app startup logic including connectivity and authentication checks
class AppStartup {
  AppStartup._();

  /// Determines the initial route based on connectivity and authentication status
  static Future<String> determineInitialRoute(
    ProviderContainer container,
  ) async {
    // Check connectivity first
    final bool isConnected = await _checkConnectivity(container);

    if (!isConnected) {
      return Routes.noConnection;
    }

    // If connected, check authentication
    final bool isAuthenticated = await _checkAuthentication(container);

    return isAuthenticated ? Routes.home : Routes.root;
  }

  /// Checks network connectivity status
  static Future<bool> _checkConnectivity(ProviderContainer container) async {
    return await container
        .read(checkConnectivityUseCaseProvider)
        .call()
        .then((ConnectivityEntity value) => value.isConnected);
  }

  /// Checks user authentication status
  static Future<bool> _checkAuthentication(ProviderContainer container) async {
    return await container.read(authStateProvider.future);
  }
}
