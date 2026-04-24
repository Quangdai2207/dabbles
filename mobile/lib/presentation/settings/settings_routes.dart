import 'package:dabble/core/routing/route_handler.dart';
import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/presentation/settings/screens/blocked_users_screen.dart';
import 'package:dabble/presentation/settings/screens/change_password_screen.dart';
import 'package:dabble/presentation/settings/screens/edit_profile_screen.dart';
import 'package:dabble/presentation/settings/screens/settings_screen.dart';
import 'package:flutter/material.dart';

class SettingsRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    if (settings.name == Routes.settings) {
      return protectedRoute(child: const SettingsScreen(), settings: settings);
    }
    if (settings.name == Routes.changePassword) {
      return protectedRoute(
        child: const ChangePasswordScreen(),
        settings: settings,
      );
    }
    if (settings.name == Routes.blockedUsers) {
      return protectedRoute(
        child: const BlockedUsersScreen(),
        settings: settings,
      );
    }
    if (settings.name == Routes.editProfile) {
      return protectedRoute(
        child: const EditProfileScreen(),
        settings: settings,
      );
    }
    return null;
  }
}
