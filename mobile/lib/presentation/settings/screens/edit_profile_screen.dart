import 'dart:io';

import 'package:dabble/features/auth/domain/entities/profile_entity.dart';
import 'package:dabble/presentation/auth/providers/user_provider.dart';
import 'package:dabble/shared/utils/toast_utils.dart';
import 'package:dabble/shared/widgets/ui/app_button.dart';
import 'package:dabble/shared/widgets/ui/app_text_field.dart';
import 'package:dabble/shared/widgets/ui/common_app_bar.dart';
import 'package:dabble/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../controllers/edit_profile_controller.dart';
import '../providers/edit_profile_provider.dart';
import '../states/edit_profile_state.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  late TextEditingController _emailController;
  late TextEditingController _usernameController;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _phoneController;
  late TextEditingController _dobController;

  @override
  void initState() {
    super.initState();
    final ProfileEntity? user = ref.read(currentUserProvider).value;
    final EditProfileController controller = ref.read(
      editProfileControllerProvider.notifier,
    );

    // Initialize controllers with user data
    _emailController = TextEditingController(text: user?.email ?? '');
    _usernameController = TextEditingController(text: user?.username ?? '');
    _firstNameController = TextEditingController(text: user?.firstName ?? '');
    _lastNameController = TextEditingController(text: user?.lastName ?? '');
    _phoneController = TextEditingController(text: user?.phone ?? '');
    _dobController = TextEditingController();

    // Initialize state
    Future<void>.microtask(() => controller.init(user));
  }

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? pickedFile = await picker.pickImage(
      source: ImageSource.gallery,
    );

    if (pickedFile != null) {
      ref
          .read(editProfileControllerProvider.notifier)
          .setAvatarPath(pickedFile.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    final EditProfileState state = ref.watch(editProfileControllerProvider);
    final EditProfileController controller = ref.read(
      editProfileControllerProvider.notifier,
    );
    final ProfileEntity? user = ref.watch(currentUserProvider).value;

    // Sync text controllers with state if needed (optional, mainly for initial load or external updates)
    if (_usernameController.text != state.username) {
      _usernameController.text = state.username;
    }
    if (_firstNameController.text != state.firstName) {
      _firstNameController.text = state.firstName;
    }
    if (_lastNameController.text != state.lastName) {
      _lastNameController.text = state.lastName;
    }
    if (_phoneController.text != state.phone) {
      _phoneController.text = state.phone;
    }
    if (_dobController.text != state.dob) {
      _dobController.text = state.dob;
    }

    ref.listen(editProfileControllerProvider, (
      EditProfileState? previous,
      EditProfileState next,
    ) {
      if (next.status.hasError) {
        ToastUtils.showError(
          context,
          title: 'Update Failed',
          description: next.status.error.toString(),
        );
      } else if (next.status is AsyncData && previous?.status is AsyncLoading) {
        ToastUtils.showSuccess(
          context,
          title: 'Success',
          description: 'Profile updated successfully',
        );
        Navigator.of(context).pop();
      }
    });

    return Scaffold(
      appBar: const CommonAppBar(title: 'Edit Profile'),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: <Widget>[
            Center(
              child: Stack(
                children: <Widget>[
                  GestureDetector(
                    onTap: _pickImage,
                    child: UserAvatar(
                      radius: 50,
                      imageFile: state.avatarPath != null
                          ? File(state.avatarPath!)
                          : null,
                      avatarUrl: user?.avatar,
                      name: user?.firstName ?? user?.username ?? 'U',
                      fontSize: 40,
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Theme.of(context).primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          LucideIcons.camera,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            AppTextField(
              controller: _emailController,
              label: 'Email',
              hint: 'Your email address',
              prefixIcon: LucideIcons.mail,
              readOnly: true,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _usernameController,
              label: 'Username',
              hint: 'Enter your username',
              prefixIcon: LucideIcons.user,
              errorMessage: state.usernameError,
              onChanged: controller.setUsername,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _firstNameController,
              label: 'First Name',
              hint: 'Enter your first name',
              prefixIcon: LucideIcons.user,
              errorMessage: state.firstNameError,
              onChanged: controller.setFirstName,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _lastNameController,
              label: 'Last Name',
              hint: 'Enter your last name',
              prefixIcon: LucideIcons.user,
              errorMessage: state.lastNameError,
              onChanged: controller.setLastName,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _phoneController,
              label: 'Phone',
              hint: 'Enter your phone number',
              prefixIcon: LucideIcons.phone,
              keyboardType: TextInputType.phone,
              onChanged: controller.setPhone,
              errorMessage: state.phoneError,
            ),
            const SizedBox(height: 16),
            AppTextField(
              controller: _dobController,
              label: 'Date of Birth',
              hint: 'Select your date of birth',
              prefixIcon: LucideIcons.calendar,
              readOnly: true,
              errorMessage: state.dobError,
              onTap: () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (picked != null) {
                  final String formatted =
                      '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
                  controller.setDob(formatted);
                }
              },
            ),
            const SizedBox(height: 32),
            AppButton(
              text: 'Save Changes',
              isLoading: state.status.isLoading,
              onPressed: controller.updateProfile,
            ),
          ],
        ),
      ),
    );
  }
}
