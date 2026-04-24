import '../../core/config/env.dart';

class ImageUrlHelper {
  static String getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    final String baseUrl = Env.imageBaseUrl.replaceAll(RegExp(r'/+$'), '');
    final String cleanPath = path.startsWith('/') ? path : '/$path';

    return '$baseUrl$cleanPath'.trim();
  }
}
