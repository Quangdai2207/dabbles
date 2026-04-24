import 'package:cloudflare_turnstile/cloudflare_turnstile.dart';
import 'package:dabble/core/config/env.dart';

import 'package:flutter/material.dart';

/// Turnstile captcha widget for auth screens
class TurnstileCaptcha extends StatelessWidget {
  const TurnstileCaptcha({
    required this.controller,
    required this.onTokenReceived,
    required this.onTokenExpired,
    super.key,
  });

  final TurnstileController controller;
  final void Function(String?) onTokenReceived;
  final VoidCallback onTokenExpired;

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final String siteKey = Env.turnstileSiteKey;

    // Validate site key
    if (siteKey.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red.withValues(alpha: 0.1),
          border: Border.all(color: Colors.red),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Icon(Icons.error_outline, color: Colors.red, size: 32),
            SizedBox(height: 8),
            Text(
              'Turnstile Configuration Error',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              'TURNSTILE_SITE_KEY is missing in .env file',
              style: TextStyle(color: Colors.red, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return Center(
      child: CloudflareTurnstile(
        siteKey: siteKey,
        controller: controller,
        options: TurnstileOptions(
          theme: isDark ? TurnstileTheme.dark : TurnstileTheme.light,
          size: TurnstileSize.normal,
        ),
        onTokenReceived: onTokenReceived,
        onTokenExpired: onTokenExpired,
        onError: (TurnstileException error) {
          onTokenExpired();
        },
      ),
    );
  }
}
