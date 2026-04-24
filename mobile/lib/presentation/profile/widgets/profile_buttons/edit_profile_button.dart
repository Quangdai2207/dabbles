import 'package:flutter/material.dart';

/// Edit Profile button for own profile.
///
/// Navigates to the edit profile screen.
class EditProfileButton extends StatelessWidget {
  const EditProfileButton({super.key});

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return ElevatedButton(
      onPressed: () => Navigator.pushNamed(context, '/settings/edit-profile'),
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: const Text(
        'Edit Profile',
        style: TextStyle(fontWeight: FontWeight.w600),
      ),
    );
  }
}
