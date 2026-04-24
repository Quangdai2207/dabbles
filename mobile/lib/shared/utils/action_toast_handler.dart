import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:flutter/material.dart';

/// Utility class for handling async actions with toast notifications.
///
/// Provides a centralized way to execute async actions and show
/// success/error toasts based on the result.
class ActionToastHandler {
  /// Executes an async action and shows appropriate toast notification.
  ///
  /// [context] - BuildContext for showing toasts
  /// [action] - Async function that returns null on success or error message on failure
  /// [successMessage] - Message to show on successful action
  /// [onSuccess] - Optional callback to execute on success
  static Future<void> execute(
    BuildContext context,
    Future<String?> Function() action,
    String successMessage, {
    VoidCallback? onSuccess,
  }) async {
    final String? error = await action();

    if (!context.mounted) return;

    if (error == null) {
      ToastUtils.showSuccess(context, title: successMessage);
      onSuccess?.call();
    } else {
      ToastUtils.showError(context, title: error);
    }
  }
}
