import 'dart:io';

import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

class ImageConverter {
  static Future<File?> convertToJpg(String path) async {
    try {
      final File file = File(path);
      if (!file.existsSync()) return null;

      // Creating a temp file in cache directory to avoid overwriting or littering
      final Directory tempDir = await getTemporaryDirectory();
      final String targetPath = p.join(
        tempDir.path,
        "temp_${DateTime.now().millisecondsSinceEpoch}.jpg",
      );

      final XFile? result = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path,
        targetPath,
        quality: 90, // Adjust quality as needed
        format: CompressFormat.jpeg,
      );

      return result != null ? File(result.path) : null;
    } catch (e) {
      // In case of error (e.g. not an image), return null or throw
      return null;
    }
  }
}
