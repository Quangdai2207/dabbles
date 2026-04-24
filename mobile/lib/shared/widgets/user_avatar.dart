import 'dart:io';

import 'package:dabble/core/config/env.dart';
import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  const UserAvatar({
    super.key,
    this.avatarUrl,
    this.imageFile,
    this.name,
    this.radius = 20,
    this.fontSize,
  });

  final String? avatarUrl;
  final File? imageFile;
  final String? name;
  final double radius;
  final double? fontSize;

  @override
  Widget build(BuildContext context) {
    ImageProvider? imageProvider;

    if (imageFile != null) {
      imageProvider = FileImage(imageFile!);
    } else if (avatarUrl != null && avatarUrl!.isNotEmpty) {
      final String fullUrl = avatarUrl!.startsWith('http')
          ? avatarUrl!
          : '${Env.imageBaseUrl}$avatarUrl';
      imageProvider = NetworkImage(fullUrl);
    }

    if (imageProvider != null) {
      return CircleAvatar(
        radius: radius,
        backgroundImage: imageProvider,
        backgroundColor: Colors.grey[200],
      );
    }

    // Fallback to initials or default icon
    final String initials = (name != null && name!.isNotEmpty)
        ? name![0].toUpperCase()
        : '?';

    return CircleAvatar(
      radius: radius,
      backgroundColor: Colors.grey[200],
      child: Text(
        initials,
        style: TextStyle(
          fontSize: fontSize ?? radius,
          fontWeight: FontWeight.bold,
          color: Colors.grey[600],
        ),
      ),
    );
  }
}
