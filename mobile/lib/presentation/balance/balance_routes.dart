import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../core/routing/route_handler.dart';
import '../../core/routing/routes.dart';
import 'screens/balance_screen.dart';

class BalanceRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    switch (settings.name) {
      case Routes.balance:
        return protectedRoute(child: const BalanceScreen(), settings: settings);
      default:
        return null;
    }
  }
}
