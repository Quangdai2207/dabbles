import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../core/routing/route_handler.dart';
import '../../../core/routing/routes.dart';
import '../../../presentation/balance/balance_routes.dart';
import '../../../presentation/commons/screens/no_connection_screen.dart';
import '../../../presentation/commons/screens/not_found_screen.dart';
import '../../../presentation/commons/widgets/auth_layout.dart';
import '../../../presentation/home/home_routes.dart';
import '../../../presentation/library/library_routes.dart';
import '../../../presentation/post/post_routes.dart';
import '../../../presentation/profile/profile_routes.dart';
import '../../../presentation/settings/settings_routes.dart';

/// App Connection Routing
class AppRouter {
  AppRouter._();
  static List<RouteHandler> get _handlers => <RouteHandler>[
    HomeRoutes(),
    SettingsRoutes(),
    ProfileRoutes(),
    PostRoutes(),
    LibraryRoutes(),
    BalanceRoutes(),
  ];

  static const String initial = Routes.root;

  // Or use onGenerateRoute for more complex logic
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    // Handle No Connection Route
    if (settings.name == Routes.noConnection) {
      return MaterialPageRoute<dynamic>(
        builder: (BuildContext context) => const NoConnectionScreen(),
        settings: settings,
      );
    }

    // Handle Auth Routes directly
    if (settings.name == Routes.root ||
        settings.name == Routes.welcome ||
        settings.name == Routes.login ||
        settings.name == Routes.register) {
      return CupertinoPageRoute<dynamic>(
        builder: (BuildContext context) =>
            AuthLayout(initialRoute: settings.name),
        settings: settings,
      );
    }

    // Handle other routes via handlers
    for (final RouteHandler handler in _handlers) {
      final Route<dynamic>? route = handler.handle(settings);
      if (route != null) {
        return route;
      }
    }

    return MaterialPageRoute<dynamic>(
      settings: settings,
      builder: (_) => const NotFoundScreen(),
    );
  }
}
