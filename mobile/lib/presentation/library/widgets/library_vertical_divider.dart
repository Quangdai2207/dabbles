import 'package:flutter/material.dart';

class LibraryVerticalDivider extends StatelessWidget {
  const LibraryVerticalDivider({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(
          left: BorderSide(
            color: theme.colorScheme.outlineVariant.withAlpha(128),
            width: 1,
          ),
        ),
      ),
      child: const SizedBox(height: 24),
    );
  }
}
