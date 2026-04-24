import 'dart:io';

import 'package:image_picker/image_picker.dart';

/// Utility class for image picking operations
class ImagePickerUtils {
  ImagePickerUtils._();

  static final ImagePicker _picker = ImagePicker();

  /// Pick single image from gallery
  static Future<File?> pickImageFromGallery({
    int? maxWidth,
    int? maxHeight,
    int? imageQuality,
  }) async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: maxWidth?.toDouble(),
      maxHeight: maxHeight?.toDouble(),
      imageQuality: imageQuality,
    );
    return image != null ? File(image.path) : null;
  }

  /// Pick single image from camera
  static Future<File?> pickImageFromCamera({
    int? maxWidth,
    int? maxHeight,
    int? imageQuality,
    CameraDevice preferredCameraDevice = CameraDevice.rear,
  }) async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: maxWidth?.toDouble(),
      maxHeight: maxHeight?.toDouble(),
      imageQuality: imageQuality,
      preferredCameraDevice: preferredCameraDevice,
    );
    return image != null ? File(image.path) : null;
  }

  /// Pick multiple images from gallery
  static Future<List<File>> pickMultipleImages({
    int? maxWidth,
    int? maxHeight,
    int? imageQuality,
    int? limit,
  }) async {
    final List<XFile> images = await _picker.pickMultiImage(
      maxWidth: maxWidth?.toDouble(),
      maxHeight: maxHeight?.toDouble(),
      imageQuality: imageQuality,
      limit: limit,
    );
    return images.map((XFile xFile) => File(xFile.path)).toList();
  }

  /// Pick video from gallery
  static Future<File?> pickVideoFromGallery({Duration? maxDuration}) async {
    final XFile? video = await _picker.pickVideo(
      source: ImageSource.gallery,
      maxDuration: maxDuration,
    );
    return video != null ? File(video.path) : null;
  }

  /// Pick video from camera
  static Future<File?> pickVideoFromCamera({
    Duration? maxDuration,
    CameraDevice preferredCameraDevice = CameraDevice.rear,
  }) async {
    final XFile? video = await _picker.pickVideo(
      source: ImageSource.camera,
      maxDuration: maxDuration,
      preferredCameraDevice: preferredCameraDevice,
    );
    return video != null ? File(video.path) : null;
  }

  /// Pick media (image or video) from gallery
  static Future<File?> pickMedia() async {
    final XFile? media = await _picker.pickMedia();
    return media != null ? File(media.path) : null;
  }

  /// Pick multiple media from gallery
  static Future<List<File>> pickMultipleMedia({int? limit}) async {
    final List<XFile> mediaList = await _picker.pickMultipleMedia(limit: limit);
    return mediaList.map((XFile xFile) => File(xFile.path)).toList();
  }
}
