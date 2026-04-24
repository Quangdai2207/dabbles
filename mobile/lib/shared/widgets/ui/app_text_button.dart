import 'package:flutter/material.dart';

/// Reusable themed text button
class AppTextButton extends StatelessWidget {
  const AppTextButton({
    required this.text,
    required this.onPressed,
    super.key,
    this.fontSize = 14,
    this.fontWeight = FontWeight.w500,
    this.color,
  });

  final String text;
  final VoidCallback onPressed;
  final double fontSize;
  final FontWeight fontWeight;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        minimumSize: Size.zero,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: color ?? theme.colorScheme.primary,
          fontFamily: theme.textTheme.labelMedium?.fontFamily,
        ),
      ),
    );
  }
}
