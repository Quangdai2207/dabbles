import 'package:dabble/shared/constants/assets.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/routing/routes.dart';
import '../providers/connectivity_provider.dart';
import '../states/connectivity_state.dart';

class NoConnectionScreen extends ConsumerStatefulWidget {
  const NoConnectionScreen({super.key});

  @override
  ConsumerState<NoConnectionScreen> createState() => _NoConnectionScreenState();
}

class _NoConnectionScreenState extends ConsumerState<NoConnectionScreen> {
  DateTime? _lastBackPressed;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Ignore unawaited_futures as this is intentional fire-and-forget
      // ignore: unawaited_futures
      ref.read(connectivityControllerProvider.notifier).checkConnectivity();
    });
  }

  Future<void> _handleRefresh() async {
    await ref
        .read(connectivityControllerProvider.notifier)
        .refreshConnectivity();

    // If connected, navigate to home
    final ConnectivityState state = ref.read(connectivityControllerProvider);
    if (state.isConnected && mounted) {
      // ignore: unawaited_futures
      Navigator.of(context).pushReplacementNamed<void, void>(Routes.root);
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ConnectivityState state = ref.watch(connectivityControllerProvider);
    final bool isChecking = state.status == ConnectivityStatus.checking;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) {
        if (didPop) {
          return;
        }

        final DateTime now = DateTime.now();
        final bool backButtonPressedTwice =
            _lastBackPressed != null &&
            now.difference(_lastBackPressed!) < const Duration(seconds: 2);

        if (backButtonPressedTwice) {
          // Exit app
          // ignore: unawaited_futures
          SystemNavigator.pop();
          return;
        }

        // First back press - show toast
        _lastBackPressed = now;
        ToastUtils.showInfo(
          context,
          title: 'Press back again to exit',
          autoCloseDuration: const Duration(seconds: 2),
        );
      },
      child: Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  // Dabble Logo
                  Image.asset(
                    Assets.dabbleLogo,
                    width: 300,
                    height: 300,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(height: 16),

                  // Wifi Off Icon
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.error.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      LucideIcons.wifiOff,
                      size: 48,
                      color: theme.colorScheme.error,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Title
                  Text(
                    'No Internet Connection',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  Text(
                    'Please check your internet connection and try again. Make sure WiFi or mobile data is turned on.',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Refresh Button
                  AppButton(
                    onPressed: isChecking ? null : _handleRefresh,
                    icon: LucideIcons.refreshCw,
                    text: isChecking ? 'Checking...' : 'Try Again',
                    isLoading: isChecking,
                    width: double.infinity,
                  ),
                  const SizedBox(height: 16),

                  // Status indicator
                  if (isChecking)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Checking connection...',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
