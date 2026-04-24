import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

import '../../shared/utils/app_log.dart';

class SocketService {
  factory SocketService() => _instance;
  SocketService._internal();

  static final SocketService _instance = SocketService._internal();

  StompClient? _client;
  final String _socketUrl = dotenv.env['WS_BASE_URL'] ?? '';

  bool get isConnected => _client?.connected ?? false;

  void connect({
    required String token,
    required void Function(dynamic frame) onConnect,
    void Function(dynamic error)? onError,
  }) {
    if (_client != null && _client!.connected) {
      return;
    }

    if (_socketUrl.isEmpty) {
      AppLog.warning('Socket URL is empty');
      return;
    }

    String url = _socketUrl;
    if (url.startsWith('http://')) {
      url = url.replaceFirst('http://', 'ws://');
    } else if (url.startsWith('https://')) {
      url = url.replaceFirst('https://', 'wss://');
    }

    // Append /websocket if deemed necessary for SockJS backend support
    if (!url.endsWith('/websocket')) {
      url = '$url/websocket';
    }

    _client = StompClient(
      config: StompConfig(
        url: url,
        onConnect: onConnect,
        onWebSocketError: (dynamic error) {
          AppLog.error('WebSocket Error', error);
          onError?.call(error);
        },
        onStompError: (dynamic frame) {
          AppLog.error('Stomp Error', frame);
          onError?.call(frame);
        },
        stompConnectHeaders: <String, String>{'Authorization': 'Bearer $token'},
        webSocketConnectHeaders: <String, String>{
          'Authorization': 'Bearer $token',
        },
      ),
    );

    _client?.activate();
  }

  void disconnect() {
    _client?.deactivate();
    _client = null;
  }

  // Returns a function to unsubscribe
  void Function() subscribe(
    String destination,
    void Function(StompFrame frame) callback,
  ) {
    if (_client == null || !_client!.connected) {
      return () {};
    }

    return _client!.subscribe(destination: destination, callback: callback);
  }

  void send(String destination, {Map<String, dynamic>? body}) {
    if (_client == null || !_client!.connected) {
      return;
    }

    _client!.send(
      destination: destination,
      body: body != null ? jsonEncode(body) : '',
    );
  }
}
