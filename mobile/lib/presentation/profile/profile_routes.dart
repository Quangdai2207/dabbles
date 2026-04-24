import 'package:dabble/core/routing/route_handler.dart';
import 'package:dabble/presentation/profile/screens/user_profile_screen.dart';
import 'package:flutter/material.dart';

class ProfileRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    if (settings.name?.startsWith('/u/') ?? false) {
      final Uri uri = Uri.parse(settings.name!);
      if (uri.pathSegments.length == 2 && uri.pathSegments[0] == 'u') {
        final String username = uri.pathSegments[1];
        return protectedRoute(
          child: UserProfileScreen(username: username),
          settings: settings,
        );
      }
    }
    return null;
  }
}
