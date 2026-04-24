import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/socket_service.dart';

final Provider<SocketService> socketServiceProvider = Provider<SocketService>((
  Ref ref,
) {
  return SocketService();
});
