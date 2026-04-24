import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/presentation/auth/screens/login_screen.dart';
import 'package:dabble/presentation/auth/screens/register_screen.dart';
import 'package:dabble/presentation/welcome/screens/welcome_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AuthLayout extends StatefulWidget {
  const AuthLayout({super.key, this.initialRoute});

  final String? initialRoute;

  @override
  State<AuthLayout> createState() => _AuthLayoutState();
}

class _AuthLayoutState extends State<AuthLayout> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    setState(() {
      _currentIndex = widget.initialRoute == Routes.login
          ? 1
          : (widget.initialRoute == Routes.register ? 2 : 0);
    });
  }

  void _navigateToPage(int index) {
    if (_currentIndex == index) return;
    setState(() {
      _currentIndex = index;
    });
  }

  void _onPopInvoked(bool didPop, dynamic result) {
    if (didPop) return;
    if (_currentIndex != 0) {
      setState(() {
        _currentIndex = 0;
      });
    } else {
      SystemNavigator.pop();
    }
  }

  void _onWelcomeLogin() => _navigateToPage(1);
  void _onWelcomeRegister() => _navigateToPage(2);
  void _onBackToWelcome() => _navigateToPage(0);
  void _onSwitchToRegister() => _navigateToPage(2); // From Login
  void _onSwitchToLogin() => _navigateToPage(1); // From Register

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: _onPopInvoked,
      child: Scaffold(
        body: IndexedStack(
          index: _currentIndex,
          children: <Widget>[
            WelcomeScreen(
              onLoginPressed: _onWelcomeLogin,
              onRegisterPressed: _onWelcomeRegister,
            ),
            LoginScreen(
              onBackPressed: _onBackToWelcome,
              onRegisterPressed: _onSwitchToRegister,
            ),
            RegisterScreen(
              onBackPressed: _onBackToWelcome,
              onLoginPressed: _onSwitchToLogin,
            ),
          ],
        ),
      ),
    );
  }
}
