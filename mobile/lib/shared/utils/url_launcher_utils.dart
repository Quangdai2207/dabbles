import 'package:url_launcher/url_launcher.dart';

/// Utility class for URL launching operations
class UrlLauncherUtils {
  UrlLauncherUtils._();

  /// Launch URL in browser
  static Future<bool> launchInBrowser(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }

  /// Launch URL in app webview
  static Future<bool> launchInWebView(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.inAppWebView);
    }
    return false;
  }

  /// Launch URL in app browser tab
  static Future<bool> launchInAppBrowserTab(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
    }
    return false;
  }

  /// Send email
  static Future<bool> sendEmail({
    required String email,
    String? subject,
    String? body,
  }) async {
    final Uri uri = Uri(
      scheme: 'mailto',
      path: email,
      queryParameters: <String, dynamic>{
        if (subject != null) 'subject': subject,
        if (body != null) 'body': body,
      },
    );
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri);
    }
    return false;
  }

  /// Make phone call
  static Future<bool> makePhoneCall(String phoneNumber) async {
    final Uri uri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri);
    }
    return false;
  }

  /// Send SMS
  static Future<bool> sendSms(String phoneNumber, {String? message}) async {
    final Uri uri = Uri(
      scheme: 'sms',
      path: phoneNumber,
      queryParameters: message != null
          ? <String, dynamic>{'body': message}
          : null,
    );
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri);
    }
    return false;
  }

  /// Check if URL can be launched
  static Future<bool> canLaunch(String url) async {
    return await canLaunchUrl(Uri.parse(url));
  }
}
