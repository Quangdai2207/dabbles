import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Singleton service để quản lý secure storage
class StorageService {
  StorageService._();
  static final StorageService _instance = StorageService._();
  static StorageService get instance => _instance;

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  // ==================== Token Methods ====================

  Future<void> saveToken(String token) async {
    await _storage.write(key: 'token', value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'token');
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: 'token');
  }

  // ==================== Auth Session ====================

  /// Lưu token
  Future<void> saveTokens({required String token}) async {
    await Future.wait(<Future<void>>[saveToken(token)]);
  }

  /// Xóa tất cả tokens (logout)
  Future<void> clearTokens() async {
    await Future.wait(<Future<void>>[deleteToken()]);
  }

  /// Xóa tất cả dữ liệu (full logout)
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }

  /// Kiểm tra đã login chưa
  Future<bool> isLoggedIn() async {
    final String? token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // ==================== Generic Methods ====================

  /// Lưu giá trị tùy ý
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Đọc giá trị tùy ý
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  /// Xóa giá trị tùy ý
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  /// Đọc tất cả
  Future<Map<String, String>> readAll() async {
    return await _storage.readAll();
  }
}

/// Shortcut getter for StorageService
StorageService get storage => StorageService.instance;
