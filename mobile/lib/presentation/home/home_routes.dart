import 'package:dabble/core/routing/route_handler.dart';
import 'package:dabble/core/routing/routes.dart';
import 'package:flutter/material.dart';

import '../../presentation/commons/widgets/main_layout.dart';

class HomeRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    if (settings.name != Routes.home) return null;

    // Protected route - requires auth
    return protectedRoute(child: const MainLayout(), settings: settings);
  }
}
