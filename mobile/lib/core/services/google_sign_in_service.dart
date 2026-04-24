import 'package:google_sign_in/google_sign_in.dart';
import '../../shared/utils/app_log.dart';

class GoogleSignInService {
  final GoogleSignIn _googleSignIn = GoogleSignIn.instance;
  bool _isInitialized = false;

  Future<void> _ensureInitialized() async {
    if (!_isInitialized) {
      try {
        await _googleSignIn.initialize();
        _isInitialized = true;
      } catch (e) {
        AppLog.error('Google Sign In initialization failed: $e');
        // Depending on the error, we might want to rethrow or handle it.
        // For now, logging it. If it fails, authenticate might fail too.
      }
    }
  }

  Future<GoogleSignInAuthentication?> signIn() async {
    try {
      await _ensureInitialized();

      // MIGRATION: 'authenticate' replaces 'signIn' on mobile.
      // We pass scopeHint to ensure email/profile are requested, though typically default.
      final GoogleSignInAccount account = await _googleSignIn.authenticate(
        scopeHint: <String>['email', 'profile', 'openid'],
      );

      return account.authentication;
    } catch (e) {
      // In v7, cancellation is also an exception with code canceled.
      if (e is GoogleSignInException &&
          e.code == GoogleSignInExceptionCode.canceled) {
        AppLog.info('Google Sign In cancelled by user');
      } else {
        AppLog.error('Google Sign In failed: $e');
      }
      return null;
    }
  }

  Future<void> signOut() async {
    try {
      await _ensureInitialized();
      await _googleSignIn.disconnect();
    } catch (e) {
      AppLog.error('Google Sign Out failed: $e');
    }
  }
}
