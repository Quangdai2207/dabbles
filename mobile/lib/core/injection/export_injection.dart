/// Barrel export for ALL feature injections
///
/// IMPORTANT: This file should ONLY be imported by:
/// - presentation/ layer
/// - Other files in core/ layer (if needed)
///
/// DO NOT import this in features/*/injection/ files!
/// Features should only import 'core/providers/core_providers.dart'
library;

export 'package:dabble/core/injection/socket_injection.dart';
export 'package:dabble/core/providers/core_providers.dart';
export 'package:dabble/features/auth/injection/auth_injection.dart';
export 'package:dabble/features/category/injection/category_injection.dart';
export 'package:dabble/features/chat/injection/chat_injection.dart';
export 'package:dabble/features/connectivity/injection/connectivity_injection.dart';
export 'package:dabble/features/contact/injection/contact_injection.dart';
export 'package:dabble/features/image/injection/image_injection.dart';
export 'package:dabble/features/notification/injection/notification_injection.dart';
export 'package:dabble/features/user/injection/user_injection.dart';
export 'package:dabble/features/wallet/injection/wallet_injection.dart';
