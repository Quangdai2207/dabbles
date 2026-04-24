import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// AuthGuard widget that protects routes requiring authentication.
/// Redirects to login if user is not authenticated.
class AuthGuard extends ConsumerWidget {
  const AuthGuard({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final AsyncValue<bool> authState = ref.watch(authStateProvider);

    return authState.when(
      data: (bool isLoggedIn) {
        if (!isLoggedIn) {
          // Redirect to login after build
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.of(context).pushNamedAndRemoveUntil(
              Routes.login,
              (Route<dynamic> route) => false,
            );
          });

          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return child;
      },
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (Object error, StackTrace stackTrace) =>
          Scaffold(body: Center(child: Text('Error checking auth: $error'))),
    );
  }
}

/// Helper extension for wrapping pages with AuthGuard
extension AuthGuardExtension on Widget {
  Widget withAuthGuard() => AuthGuard(child: this);
}
