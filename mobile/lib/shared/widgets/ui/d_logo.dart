import 'package:flutter/material.dart';

class DLogo extends StatelessWidget {
  const DLogo({super.key, this.width, this.height});
  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/images/d-logo.png',
      width: width ?? 32,
      height: height ?? 32,
      fit: BoxFit.contain,
    );
  }
}
