import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../features/wallet/domain/entities/wallet_entity.dart';

class TransactionItem extends StatelessWidget {
  const TransactionItem({required this.transaction, super.key});

  final TransactionEntity transaction;

  IconData _getIcon() {
    final String type = transaction.type.toUpperCase();
    if (type.contains('DEPOSIT') || type.contains('PAYMENT')) {
      return LucideIcons.circleArrowDown;
    } else if (type.contains('WITHDRAWAL')) {
      return LucideIcons.circleArrowUp;
    } else if (type.contains('PURCHASE')) {
      return LucideIcons.shoppingCart;
    } else if (type.contains('SALE')) {
      return LucideIcons.tag;
    }
    return LucideIcons.arrowRightLeft;
  }

  Color _getColor(BuildContext context) {
    final String type = transaction.type.toUpperCase();
    if (type.contains('DEPOSIT') || type.contains('SALE')) {
      return Colors.green;
    } else if (type.contains('WITHDRAWAL') || type.contains('PURCHASE')) {
      return Theme.of(context).colorScheme.error;
    }
    return Theme.of(context).colorScheme.primary;
  }

  String _getSign() {
    final String type = transaction.type.toUpperCase();
    if (type.contains('DEPOSIT') || type.contains('SALE')) {
      return '+';
    } else if (type.contains('WITHDRAWAL') || type.contains('PURCHASE')) {
      return '-';
    }
    return '';
  }

  String _formatDate(DateTime date) {
    return DateFormat('MMM dd, yyyy • HH:mm').format(date);
  }

  @override
  Widget build(BuildContext context) {
    final Color color = _getColor(context);
    final String sign = _getSign();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: <Widget>[
            // Icon
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(_getIcon(), color: color, size: 24),
            ),
            const SizedBox(width: 16),
            // Transaction Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    transaction.type,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatDate(transaction.createdDate),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                  if (transaction.description != null &&
                      transaction.description!.isNotEmpty) ...<Widget>[
                    const SizedBox(height: 4),
                    Text(
                      transaction.description!,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 16),
            // Amount
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: <Widget>[
                Text(
                  '$sign\$${transaction.amount.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                if (transaction.feeAmount > 0) ...<Widget>[
                  const SizedBox(height: 4),
                  Text(
                    'Fee: \$${transaction.feeAmount.toStringAsFixed(2)}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
