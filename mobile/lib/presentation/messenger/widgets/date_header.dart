import 'package:flutter/material.dart';

import '../../../shared/constants/app_spacing.dart';
import '../../../shared/utils/date_format_utils.dart';

/// A widget that displays a date header in the chat message list.
///
/// Used to separate messages by date, showing the date in a centered,
/// rounded container with subtle background color.
class DateHeader extends StatelessWidget {
  const DateHeader({super.key, required this.date});

  final DateTime date;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(AppSpacing.md),
        ),
        child: Text(
          DateFormatUtils.formatDateShort(date),
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ),
    );
  }
}
