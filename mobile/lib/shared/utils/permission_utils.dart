import 'package:permission_handler/permission_handler.dart';

/// Utility class for permission handling
class PermissionUtils {
  PermissionUtils._();

  // ==================== Single Permission ====================

  /// Request single permission
  static Future<bool> request(Permission permission) async {
    final PermissionStatus status = await permission.request();
    return status.isGranted;
  }

  /// Check if permission is granted
  static Future<bool> isGranted(Permission permission) async {
    return await permission.isGranted;
  }

  /// Check if permission is denied
  static Future<bool> isDenied(Permission permission) async {
    return await permission.isDenied;
  }

  /// Check if permission is permanently denied
  static Future<bool> isPermanentlyDenied(Permission permission) async {
    return await permission.isPermanentlyDenied;
  }

  /// Get permission status
  static Future<PermissionStatus> getStatus(Permission permission) async {
    return await permission.status;
  }

  // ==================== Multiple Permissions ====================

  /// Request multiple permissions
  static Future<Map<Permission, PermissionStatus>> requestMultiple(
    List<Permission> permissions,
  ) async {
    return await permissions.request();
  }

  /// Check if all permissions are granted
  static Future<bool> areAllGranted(List<Permission> permissions) async {
    for (final Permission permission in permissions) {
      if (!await permission.isGranted) {
        return false;
      }
    }
    return true;
  }

  // ==================== Common Permission Requests ====================

  /// Request camera permission
  static Future<bool> requestCamera() async {
    return await request(Permission.camera);
  }

  /// Request photos/gallery permission
  static Future<bool> requestPhotos() async {
    return await request(Permission.photos);
  }

  /// Request storage permission
  static Future<bool> requestStorage() async {
    return await request(Permission.storage);
  }

  /// Request microphone permission
  static Future<bool> requestMicrophone() async {
    return await request(Permission.microphone);
  }

  /// Request location permission
  static Future<bool> requestLocation() async {
    return await request(Permission.location);
  }

  /// Request notification permission
  static Future<bool> requestNotification() async {
    return await request(Permission.notification);
  }

  /// Request contacts permission
  static Future<bool> requestContacts() async {
    return await request(Permission.contacts);
  }

  // ==================== Settings ====================

  /// Open app settings
  static Future<bool> openSettings() async {
    return await openAppSettings();
  }

  // ==================== Combined Requests ====================

  /// Request camera and microphone for video recording
  static Future<bool> requestCameraAndMicrophone() async {
    final Map<Permission, PermissionStatus> statuses = await requestMultiple(
      <Permission>[Permission.camera, Permission.microphone],
    );
    return statuses.values.every((PermissionStatus status) => status.isGranted);
  }

  /// Request all media permissions (camera, photos, storage)
  static Future<bool> requestMediaPermissions() async {
    final Map<Permission, PermissionStatus> statuses = await requestMultiple(
      <Permission>[Permission.camera, Permission.photos, Permission.storage],
    );
    return statuses.values.every((PermissionStatus status) => status.isGranted);
  }
}
