import 'dart:io';

import 'package:path_provider/path_provider.dart';

/// Utility class for file path operations
class PathUtils {
  PathUtils._();

  /// Get app documents directory
  static Future<Directory> get documentsDir async {
    return await getApplicationDocumentsDirectory();
  }

  /// Get app cache directory
  static Future<Directory> get cacheDir async {
    return await getApplicationCacheDirectory();
  }

  /// Get app support directory
  static Future<Directory> get supportDir async {
    return await getApplicationSupportDirectory();
  }

  /// Get temporary directory
  static Future<Directory> get tempDir async {
    return await getTemporaryDirectory();
  }

  /// Get external storage directory (Android only)
  static Future<Directory?> get externalStorageDir async {
    if (Platform.isAndroid) {
      return await getExternalStorageDirectory();
    }
    return null;
  }

  /// Get downloads directory
  static Future<Directory?> get downloadsDir async {
    return await getDownloadsDirectory();
  }

  /// Create file path in documents directory
  static Future<String> getDocumentPath(String fileName) async {
    final Directory dir = await documentsDir;
    return '${dir.path}/$fileName';
  }

  /// Create file path in cache directory
  static Future<String> getCachePath(String fileName) async {
    final Directory dir = await cacheDir;
    return '${dir.path}/$fileName';
  }

  /// Create file path in temp directory
  static Future<String> getTempPath(String fileName) async {
    final Directory dir = await tempDir;
    return '${dir.path}/$fileName';
  }
}
