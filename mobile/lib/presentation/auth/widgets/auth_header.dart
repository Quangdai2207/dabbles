import 'package:dabble/shared/constants/assets.dart';
import 'package:flutter/material.dart';

/// Auth header with logo, title and subtitle
class AuthHeader extends StatelessWidget {
  const AuthHeader({
    required this.title,
    required this.subtitle,
    super.key,
    this.logoHeight = 80,
  });

  final String title;
  final String subtitle;
  final double logoHeight;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Column(
      children: <Widget>[
        // Logo
        Center(child: Image.asset(Assets.logo, height: logoHeight)),
        const SizedBox(height: 48),
        // Title
        Text(
          title,
          style: theme.textTheme.titleLarge?.copyWith(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        // Subtitle
        Text(
          subtitle,
          style: theme.textTheme.labelMedium?.copyWith(fontSize: 16),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
