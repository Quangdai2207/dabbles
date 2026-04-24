import 'package:dabble/core/guards/auth_guard.dart';
import 'package:flutter/cupertino.dart';

abstract class RouteHandler {
  Route<dynamic>? handle(RouteSettings settings);

  /// Helper to wrap a page with AuthGuard if route requires auth
  Route<dynamic> protectedRoute({
    required Widget child,
    required RouteSettings settings,
  }) {
    return CupertinoPageRoute<dynamic>(
      builder: (BuildContext context) => AuthGuard(child: child),
      settings: settings,
    );
  }
}
