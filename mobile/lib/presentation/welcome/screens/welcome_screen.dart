import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:dabble/shared/widgets/ui/app_outlined_button.dart';
import 'package:dabble/shared/widgets/ui/d_logo.dart';
import 'package:flutter/material.dart';

class WelcomeScreenProps {
  WelcomeScreenProps({this.title, this.message});
  final String? title;
  final String? message;
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({
    super.key,
    this.title,
    this.message,
    this.onLoginPressed,
    this.onRegisterPressed,
  });
  final String? title;
  final String? message;
  final VoidCallback? onLoginPressed;
  final VoidCallback? onRegisterPressed;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final TextTheme textTheme = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Stack(
        children: <Widget>[
          // Background Gradient decoration
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: <Color>[
                    colorScheme.primaryContainer.withAlpha(77),
                    theme.scaffoldBackgroundColor,
                  ],
                  stops: const <double>[0.0, 0.4],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: <Widget>[
                  const Spacer(),

                  // Animated Logo
                  const Hero(
                    tag: 'app_logo',
                    child: DLogo(width: 120, height: 120),
                  ),

                  const SizedBox(height: 48),

                  // Title
                  Text(
                    title ?? 'Welcome to Dabble',
                    style: textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onSurface,
                      letterSpacing: -0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Discover, Create, and Share.\nThe best platform for your creative journey.',
                    style: textTheme.bodyLarge?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  if (message != null) ...<Widget>[
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.secondaryContainer,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        message!,
                        style: textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSecondaryContainer,
                          fontWeight: FontWeight.w600,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],

                  const Spacer(flex: 2),

                  // Buttons
                  AppButton(
                    width: double.infinity,
                    height: 56,
                    text: 'Sign In',
                    onPressed: () {
                      if (onLoginPressed != null) {
                        onLoginPressed!();
                      } else {
                        Navigator.of(context).pushNamed(Routes.login);
                      }
                    },
                  ),

                  const SizedBox(height: 16),

                  AppOutlinedButton(
                    width: double.infinity,
                    height: 56,
                    text: 'Create Account',
                    onPressed: () {
                      if (onRegisterPressed != null) {
                        onRegisterPressed!();
                      } else {
                        Navigator.of(context).pushNamed(Routes.register);
                      }
                    },
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
