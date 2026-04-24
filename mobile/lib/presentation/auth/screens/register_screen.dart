import 'package:cloudflare_turnstile/cloudflare_turnstile.dart';
import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/shared/utils/date_format_utils.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:dabble/shared/widgets/ui/app_text_field.dart';
import 'package:dabble/shared/widgets/ui/turnstile_captcha.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../controllers/register_controller.dart';
import '../providers/register_provider.dart';
import '../states/register_state.dart';
import '../widgets/auth_footer.dart';
import '../widgets/auth_header.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key, this.onLoginPressed, this.onBackPressed});

  final VoidCallback? onLoginPressed;
  final VoidCallback? onBackPressed;

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _passwordConfirmController =
      TextEditingController();
  final TextEditingController _dateOfBirthController = TextEditingController();
  late final TurnstileController _turnstileController;

  @override
  void initState() {
    super.initState();
    _turnstileController = TurnstileController();
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _passwordConfirmController.dispose();
    _dateOfBirthController.dispose();
    _turnstileController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(
        const Duration(days: 365 * 18),
      ), // ~18yo
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      final String formatted = DateFormatUtils.formatDate(picked);
      _dateOfBirthController.text = formatted;
      ref
          .read<RegisterController>(registerControllerProvider.notifier)
          .setDateOfBirth(formatted);
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final RegisterState state = ref.watch(registerControllerProvider);
    final RegisterController controller = ref.read(
      registerControllerProvider.notifier,
    );

    // Listen for state changes
    ref.listen<RegisterState>(registerControllerProvider, (
      RegisterState? prev,
      RegisterState next,
    ) {
      // Show error toast
      if (next.status == RegisterStatus.error &&
          prev?.status != RegisterStatus.error &&
          next.errorMessage != null &&
          next.errorMessage!.isNotEmpty) {
        ToastUtils.showError(
          context,
          title: 'Registration Failed',
          description: next.errorMessage,
        );
      }

      // Show success toast
      if (next.status == RegisterStatus.success &&
          prev?.status != RegisterStatus.success) {
        ToastUtils.showSuccess(
          context,
          title: 'Registration Successful',
          description: next.successMessage ?? 'Please sign in to continue',
          autoCloseDuration: const Duration(seconds: 5),
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
                title: 'Create Account',
                subtitle: 'Sign up to get started',
              ),

              const SizedBox(height: 32),

              // First Name & Last Name Row
              Row(
                children: <Widget>[
                  Expanded(
                    child: AppTextField(
                      controller: _firstNameController,
                      label: 'First Name',
                      hint: 'John',
                      prefixIcon: LucideIcons.user,
                      keyboardType: TextInputType.name,
                      textCapitalization: TextCapitalization.words,
                      onChanged: controller.setFirstName,
                      errorMessage: state.firstNameError,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      controller: _lastNameController,
                      label: 'Last Name',
                      hint: 'Doe',
                      prefixIcon: LucideIcons.user,
                      keyboardType: TextInputType.name,
                      textCapitalization: TextCapitalization.words,
                      onChanged: controller.setLastName,
                      errorMessage: state.lastNameError,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Username field
              AppTextField(
                controller: _usernameController,
                label: 'Username',
                hint: 'johndoe123',
                prefixIcon: LucideIcons.atSign,
                keyboardType: TextInputType.text,
                onChanged: controller.setUsername,
                errorMessage: state.usernameError,
              ),

              const SizedBox(height: 16),

              // Email field
              AppTextField(
                controller: _emailController,
                label: 'Email',
                hint: 'john@example.com',
                prefixIcon: LucideIcons.mail,
                keyboardType: TextInputType.emailAddress,
                onChanged: controller.setEmail,
                errorMessage: state.emailError,
              ),

              const SizedBox(height: 16),

              // Phone field
              AppTextField(
                controller: _phoneController,
                label: 'Phone',
                hint: '+84 123 456 789',
                prefixIcon: LucideIcons.phone,
                keyboardType: TextInputType.phone,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.allow(RegExp(r'[0-9+\-\s()]')),
                ],
                onChanged: controller.setPhone,
                errorMessage: state.phoneError,
              ),

              const SizedBox(height: 16),

              // Date of Birth field
              AppTextField(
                controller: _dateOfBirthController,
                label: 'Date of Birth',
                hint: 'dd/MM/yyyy',
                prefixIcon: LucideIcons.calendar,
                keyboardType: TextInputType.none,
                readOnly: true,
                onTap: () => _selectDate(context),
                errorMessage: state.dateOfBirthError,
              ),

              const SizedBox(height: 16),

              // Password field
              AppTextField(
                controller: _passwordController,
                label: 'Password',
                hint: 'At least 6 characters',
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

              const SizedBox(height: 16),

              // Confirm Password field
              AppTextField(
                controller: _passwordConfirmController,
                label: 'Confirm Password',
                hint: 'Re-enter your password',
                prefixIcon: LucideIcons.lock,
                obscureText: !state.isPasswordConfirmVisible,
                suffixIcon: IconButton(
                  icon: Icon(
                    state.isPasswordConfirmVisible
                        ? LucideIcons.eyeOff
                        : LucideIcons.eye,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  onPressed: controller.togglePasswordConfirmVisibility,
                ),
                onChanged: controller.setPasswordConfirm,
                errorMessage: state.passwordConfirmError,
              ),

              const SizedBox(height: 24),

              // Captcha
              TurnstileCaptcha(
                controller: _turnstileController,
                onTokenReceived: controller.setCaptchaToken,
                onTokenExpired: () => controller.setCaptchaToken(null),
              ),

              const SizedBox(height: 24),

              // Register button
              AppButton(
                text: 'Sign Up',
                isLoading: state.status == RegisterStatus.loading,
                onPressed: () => controller.register(context),
              ),

              const SizedBox(height: 24),

              // Sign in link
              AuthFooter(
                message: 'Already have an account? ',
                actionText: 'Sign In',
                onAction: () {
                  if (widget.onLoginPressed != null) {
                    widget.onLoginPressed!();
                  } else {
                    Navigator.of(context).pushReplacementNamed(Routes.login);
                  }
                },
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
