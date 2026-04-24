class Routes {
  static const String root = '/';
  static const String welcome = '/welcome';
  static const String home = '/home';
  static const String login = '/login';
  static const String register = '/register';
  static const String settings = '/settings';
  static const String balance = '/balance';
  static const String changePassword = '/settings/change-password';
  static const String blockedUsers = '/settings/blocked-users';
  static const String editProfile = '/settings/edit-profile';
  static const String userProfile = '/u/:username';
  static const String library = '/library';
  static const String postDetails = '/p/:imageId';
  static const String noConnection = '/no-connection';

  static const Set<String> authRequired = <String>{home};
}
