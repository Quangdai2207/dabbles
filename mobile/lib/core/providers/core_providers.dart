import 'package:dabble/core/network/api_client.dart';
import 'package:dabble/core/services/storage_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ==================== Core Infrastructure ====================

/// Provider cho ApiClient singleton
final Provider<ApiClient> apiClientProvider = Provider<ApiClient>(
  (Ref ref) => ApiClient(),
);

/// Provider cho StorageService singleton
final Provider<StorageService> storageServiceProvider =
    Provider<StorageService>((Ref ref) => StorageService.instance);
