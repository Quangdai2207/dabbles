import 'package:flutter/cupertino.dart';
import '../../core/routing/route_handler.dart';
import 'screens/post_details_screen.dart';

class PostRoutes extends RouteHandler {
  @override
  Route<dynamic>? handle(RouteSettings settings) {
    if (settings.name == null) return null;

    final Uri uri = Uri.parse(settings.name!);
    if (uri.pathSegments.length == 2 && uri.pathSegments[0] == 'p') {
      final String imageId = uri.pathSegments[1];
      return CupertinoPageRoute<dynamic>(
        builder: (_) => PostDetailsScreen(imageId: imageId),
        settings: settings,
      );
    }
    return null;
  }
}
