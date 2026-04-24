import 'package:dabble/shared/widgets/ui/app_text_button.dart';
import 'package:flutter/material.dart';

/// Footer with link to register/login
class AuthFooter extends StatelessWidget {
  const AuthFooter({
    required this.message,
    required this.actionText,
    required this.onAction,
    super.key,
  });

  final String message;
  final String actionText;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(message, style: theme.textTheme.labelMedium),

        AppTextButton(
          text: actionText,
          onPressed: onAction,
          fontWeight: FontWeight.w600,
        ),
      ],
    );
  }
}
