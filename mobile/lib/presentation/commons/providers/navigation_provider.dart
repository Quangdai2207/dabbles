import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Controls the current index of the MainLayout bottom navigation
final StateProvider<int> mainNavIndexProvider = StateProvider<int>(
  (Ref ref) => 0,
);
