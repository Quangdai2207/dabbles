import 'package:flutter/material.dart';

import '../../../core/routing/route_handler.dart';
import '../../../core/routing/routes.dart';
import 'screens/library_screen.dart';

class LibraryRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    if (settings.name == Routes.library) {
      return protectedRoute(
        child: const LibraryScreen(),
        settings: settings, // Protects checks auth
      );
    }
    return null;
  }
}
