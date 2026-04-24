import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'core/config/app_initializer.dart';
import 'core/config/app_startup.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize all app configurations and services
  await AppInitializer.initialize();

  // Create provider container
  final ProviderContainer container = ProviderContainer();

  // Determine initial route based on connectivity and authentication
  final String initialRoute = await AppStartup.determineInitialRoute(container);

  // Run the app
  runApp(
    UncontrolledProviderScope(
      container: container,
      child: DabbleApp(initialRoute: initialRoute),
    ),
  );
}
