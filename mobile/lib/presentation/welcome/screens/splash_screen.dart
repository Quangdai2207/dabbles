import 'package:dabble/core/routing/routes.dart';
import 'package:dabble/features/auth/injection/auth_injection.dart';
import 'package:dabble/shared/constants/assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );

    _checkAuth();
  }

  Future<void> _checkAuth() async {
    // Artificial delay for branding/smooth transition
    await Future<void>.delayed(const Duration(seconds: 3));

    if (!mounted) return;

    final bool isLoggedIn = await ref.read(authRepositoryProvider).isLoggedIn();

    if (isLoggedIn) {
      if (mounted) {
        await Navigator.of(context).pushReplacementNamed(Routes.home);
      }
    } else {
      if (mounted) {
        await Navigator.of(context).pushReplacementNamed(Routes.welcome);
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Image.asset(Assets.logo, height: 150),
          ),
        ),
      ),
    );
  }
}
