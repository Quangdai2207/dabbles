import 'package:cloudflare_turnstile/cloudflare_turnstile.dart';
import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:dabble/shared/widgets/ui/app_text_button.dart';
import 'package:dabble/shared/widgets/ui/app_text_field.dart';
import 'package:dabble/shared/widgets/ui/turnstile_captcha.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../controllers/login_controller.dart';
import '../providers/login_provider.dart';
import '../states/login_state.dart';
import '../widgets/auth_divider.dart';
import '../widgets/auth_footer.dart';
import '../widgets/auth_header.dart';
import '../widgets/google_sign_in_button.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key, this.onRegisterPressed, this.onBackPressed});

  final VoidCallback? onRegisterPressed;
  final VoidCallback? onBackPressed;

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late final TurnstileController _turnstileController;

  @override
  void initState() {
    super.initState();
    _turnstileController = TurnstileController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _turnstileController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final LoginState state = ref.watch(loginControllerProvider);
    final LoginController controller = ref.read(
      loginControllerProvider.notifier,
    );

    // Listen for state changes
    ref.listen<LoginState>(loginControllerProvider, (
      LoginState? prev,
      LoginState next,
    ) {
      // Show error toast
      if (next.status == LoginStatus.error &&
          prev?.status != LoginStatus.error &&
          next.errorMessage != null &&
          next.errorMessage!.isNotEmpty) {
        ToastUtils.showError(
          context,
          title: 'Login Failed',
          description: next.errorMessage,
        );
      }

      // Refresh captcha with delay
      if (next.needsRefreshCaptcha && !(prev?.needsRefreshCaptcha ?? false)) {
        Future<void>.delayed(const Duration(milliseconds: 500), () {
          _turnstileController.refreshToken();
          controller.clearRefreshCaptchaFlag();
        });
      }
    });

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      // Add Back Button in AppBar if callback exists
      appBar: widget.onBackPressed != null
          ? AppBar(
              leading: IconButton(
                icon: const Icon(LucideIcons.chevronLeft),
                onPressed: widget.onBackPressed,
              ),
              backgroundColor: Colors.transparent,
              elevation: 0,
            )
          : null,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              // Less top spacing since we might have an AppBar
              const SizedBox(height: 24),

              // Header
              const AuthHeader(
                title: 'Welcome Back',
                subtitle: 'Sign in to continue',
              ),

              const SizedBox(height: 40),

              // Email field
              AppTextField(
                controller: _emailController,
                label: 'Email',
                hint: 'Enter your email',
                prefixIcon: LucideIcons.mail,
                keyboardType: TextInputType.emailAddress,
                onChanged: controller.setEmail,
                errorMessage: state.emailError,
              ),

              const SizedBox(height: 16),

              // Password field
              AppTextField(
                controller: _passwordController,
                label: 'Password',
                hint: 'Enter your password',
                prefixIcon: LucideIcons.lock,
                obscureText: !state.isPasswordVisible,
                suffixIcon: IconButton(
                  icon: Icon(
                    state.isPasswordVisible
                        ? LucideIcons.eyeOff
                        : LucideIcons.eye,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  onPressed: controller.togglePasswordVisibility,
                ),
                onChanged: controller.setPassword,
                errorMessage: state.passwordError,
              ),

              const SizedBox(height: 24),

              // Captcha
              TurnstileCaptcha(
                controller: _turnstileController,
                onTokenReceived: controller.setCaptchaToken,
                onTokenExpired: () => controller.setCaptchaToken(null),
              ),

              const SizedBox(height: 24),

              // Login button
              AppButton(
                text: 'Sign In',
                isLoading: state.status == LoginStatus.loading,
                onPressed: () async {
                  final bool success = await controller.login();
                  if (success && context.mounted) {
                    await Navigator.of(context).pushNamedAndRemoveUntil(
                      Routes.home,
                      (Route<dynamic> route) => false,
                    );
                  }
                },
              ),

              const SizedBox(height: 24),

              // OR Divider
              const AuthDivider(),

              const SizedBox(height: 24),

              // Google Login Button
              GoogleSignInButton(
                isLoading: state.isGoogleLoading,
                onPressed: () async {
                  final bool success = await controller.loginWithGoogle();
                  if (success && context.mounted) {
                    await Navigator.of(context).pushNamedAndRemoveUntil(
                      Routes.home,
                      (Route<dynamic> route) => false,
                    );
                  }
                },
              ),

              const SizedBox(height: 16), // Was 24 before
              // Forgot password
              AppTextButton(
                text: 'Forgot Password?',
                onPressed: () {
                  // Navigate to forgot password
                },
              ),

              const SizedBox(height: 16),

              // Sign up link
              AuthFooter(
                message: "Don't have an account? ",
                actionText: 'Sign Up',
                onAction: () {
                  if (widget.onRegisterPressed != null) {
                    widget.onRegisterPressed!();
                  } else {
                    Navigator.of(context).pushReplacementNamed(Routes.register);
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
