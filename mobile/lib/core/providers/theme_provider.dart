import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ThemeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() {
    return ThemeMode.light; // Always default to light theme
  }

  void toggleTheme() {
    state = state == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
  }

  void setTheme(ThemeMode mode) {
    state = mode;
  }
}

final NotifierProvider<ThemeNotifier, ThemeMode> themeProvider =
    NotifierProvider<ThemeNotifier, ThemeMode>(() {
      return ThemeNotifier();
    });
