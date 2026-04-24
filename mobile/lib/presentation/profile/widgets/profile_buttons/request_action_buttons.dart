import 'package:dabble/presentation/profile/utils/profile_actions.dart';
import 'package:dabble/shared/utils/action_toast_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Accept/Reject buttons for pending follow requests.
///
/// Displays two buttons side by side:
/// - Accept: Primary button to accept the request
/// - Reject: Outlined button to deny the request
class RequestActionButtons extends ConsumerWidget {
  const RequestActionButtons({super.key, required this.username});

  final String username;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ThemeData theme = Theme.of(context);

    return Row(
      children: <Widget>[
        Expanded(
          child: ElevatedButton(
            onPressed: () => _handleAccept(context, ref),
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.primary,
              foregroundColor: theme.colorScheme.onPrimary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: const Text(
              'Accept',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: OutlinedButton(
            onPressed: () => _handleReject(context, ref),
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: theme.colorScheme.outline),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: const Text(
              'Reject',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _handleAccept(BuildContext context, WidgetRef ref) async {
    await ActionToastHandler.execute(
      context,
      () => ProfileActions.acceptRequest(ref, username),
      'Accepted $username\'s request',
    );
  }

  Future<void> _handleReject(BuildContext context, WidgetRef ref) async {
    await ActionToastHandler.execute(
      context,
      () => ProfileActions.denyRequest(ref, username),
      'Denied $username\'s request',
    );
  }
}
