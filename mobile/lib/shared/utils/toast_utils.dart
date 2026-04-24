import 'package:flutter/material.dart';
import 'package:toastification/toastification.dart';

class ToastUtils {
  static void showSuccess(
    BuildContext context, {
    required String title,
    String? description,
    Duration? autoCloseDuration,
  }) {
    _show(
      context,
      type: ToastificationType.success,
      title: title,
      description: description,
      autoCloseDuration: autoCloseDuration,
    );
  }

  static void showError(
    BuildContext context, {
    required String title,
    String? description,
    Duration? autoCloseDuration,
  }) {
    _show(
      context,
      type: ToastificationType.error,
      title: title,
      description: description,
      autoCloseDuration: autoCloseDuration,
    );
  }

  static void showInfo(
    BuildContext context, {
    required String title,
    String? description,
    Duration? autoCloseDuration,
  }) {
    _show(
      context,
      type: ToastificationType.info,
      title: title,
      description: description,
      autoCloseDuration: autoCloseDuration,
    );
  }

  static void showWarning(
    BuildContext context, {
    required String title,
    String? description,
    Duration? autoCloseDuration,
  }) {
    _show(
      context,
      type: ToastificationType.warning,
      title: title,
      description: description,
      autoCloseDuration: autoCloseDuration,
    );
  }

  static void _show(
    BuildContext context, {
    required ToastificationType type,
    required String title,
    String? description,
    Duration? autoCloseDuration,
  }) {
    toastification.show(
      context: context,
      type: type,
      style: ToastificationStyle.flat,
      title: Text(title),
      description: description != null ? Text(description) : null,
      alignment: Alignment.topCenter,
      autoCloseDuration: autoCloseDuration ?? const Duration(seconds: 4),
      borderRadius: BorderRadius.circular(12),
      showProgressBar: true,
      dragToClose: true,
    );
  }
}
