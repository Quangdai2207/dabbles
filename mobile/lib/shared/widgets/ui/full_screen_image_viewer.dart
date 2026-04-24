import 'package:dabble/core/config/env.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:photo_view/photo_view.dart';

class FullScreenImageViewer extends StatefulWidget {
  const FullScreenImageViewer({
    super.key,
    required this.imageUrl,
    this.heroTag,
  });

  final String imageUrl;
  final String? heroTag;

  @override
  State<FullScreenImageViewer> createState() => _FullScreenImageViewerState();
}

class _FullScreenImageViewerState extends State<FullScreenImageViewer> {
  late PhotoViewController _photoViewController;
  double _opacity = 1.0;
  bool _enableDismiss = true;

  @override
  void initState() {
    super.initState();
    _photoViewController = PhotoViewController();
    // Lắng nghe thay đổi của controller để biết user có đang zoom hay không
    _photoViewController.outputStateStream.listen((
      PhotoViewControllerValue value,
    ) {
      if (!mounted) return;
      // Cho phép sai số nhỏ (epsilon), nếu scale > 1.05 thì coi như đang zoom
      final bool isZoomed = value.scale != null && value.scale! > 1.05;
      if (isZoomed && _enableDismiss) {
        setState(() {
          _enableDismiss = false;
        });
      } else if (!isZoomed && !_enableDismiss) {
        setState(() {
          _enableDismiss = true;
        });
      }
    });
  }

  @override
  void dispose() {
    _photoViewController.dispose();
    super.dispose();
  }

  String get _fullUrl {
    if (widget.imageUrl.startsWith('http')) {
      return widget.imageUrl;
    }
    return '${Env.imageBaseUrl}${widget.imageUrl}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: <Widget>[
          // Background layer that fades out
          Container(color: Colors.black.withValues(alpha: _opacity)),
          // Clean Dismissible implementation
          Dismissible(
            key: Key(_fullUrl),
            // CHỈ cho phép kéo đóng (vertical) nếu _enableDismiss == true (tức là không zoom)
            direction: _enableDismiss
                ? DismissDirection.vertical
                : DismissDirection.none,
            onUpdate: (DismissUpdateDetails details) {
              setState(() {
                // Fade out background as user drags
                _opacity = (1.0 - details.progress * 2).clamp(0.0, 1.0);
              });
            },
            onDismissed: (_) {
              Navigator.of(context).pop();
            },
            // Reduce threshold for easier dismissal
            dismissThresholds: const <DismissDirection, double>{
              DismissDirection.vertical: 0.2,
            },
            child: PhotoView(
              controller: _photoViewController,
              imageProvider: NetworkImage(_fullUrl),
              heroAttributes: widget.heroTag != null
                  ? PhotoViewHeroAttributes(tag: widget.heroTag!)
                  : null,
              // Critical: Transparent background to see our custom fading background
              backgroundDecoration: const BoxDecoration(
                color: Colors.transparent,
              ),
              // Facebook-like feel: min scale 1.0 (contained), max 3.0
              minScale: PhotoViewComputedScale.contained,
              maxScale: PhotoViewComputedScale.covered * 3.0,
              // Improve gesture response
              enableRotation: false,
              loadingBuilder: (BuildContext context, ImageChunkEvent? event) {
                return const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                );
              },
              errorBuilder:
                  (BuildContext context, Object error, StackTrace? stackTrace) {
                    return const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            LucideIcons.imageOff,
                            color: Colors.white,
                            size: 48,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Failed to load image',
                            style: TextStyle(color: Colors.white),
                          ),
                        ],
                      ),
                    );
                  },
            ),
          ),
          // Close button
          Positioned(
            top: MediaQuery.of(context).padding.top + 10,
            left: 10,
            child: AnimatedOpacity(
              opacity: _opacity,
              duration: const Duration(milliseconds: 100),
              child: IconButton(
                icon: const Icon(LucideIcons.x, color: Colors.white, size: 30),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
