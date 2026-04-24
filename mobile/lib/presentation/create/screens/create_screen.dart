import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../shared/utils/toast_utils.dart';
import '../../../shared/widgets/ui/app_button.dart';
import '../../commons/providers/navigation_provider.dart'; // Import this
import '../../library/providers/library_pagination_providers.dart';

import '../providers/create_post_provider.dart';
import '../states/create_post_state.dart';
import '../widgets/category_selector.dart';
import '../widgets/image_picker_field.dart';
import '../widgets/post_description_field.dart';
import '../widgets/post_pricing_field.dart';

class CreateScreen extends ConsumerStatefulWidget {
  const CreateScreen({super.key});

  @override
  ConsumerState<CreateScreen> createState() => _CreateScreenState();
}

class _CreateScreenState extends ConsumerState<CreateScreen> {
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();

  @override
  void dispose() {
    _descriptionController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      ref
          .read(createPostControllerProvider.notifier)
          .setPickedImage(File(image.path));
    }
  }

  Future<void> _publish() async {
    await ref.read(createPostControllerProvider.notifier).upload();
  }

  @override
  Widget build(BuildContext context) {
    final CreatePostState state = ref.watch(createPostControllerProvider);

    ref.listen(
      createPostControllerProvider.select((CreatePostState s) => s.status),
      (AsyncValue<void>? prev, AsyncValue<void> next) {
        next.whenOrNull(
          data: (_) {
            ToastUtils.showSuccess(
              context,
              title: 'Success',
              description: 'Post published successfully!',
            );
            ref.read(createPostControllerProvider.notifier).reset();
            _descriptionController.clear();
            _priceController.clear();

            // Refresh library data
            ref.invalidate(userPostsPaginationProvider);

            // Redirect to library (Index 3)
            ref.read(mainNavIndexProvider.notifier).state = 3;
          },
          error: (Object e, _) {
            ToastUtils.showError(
              context,
              title: 'Error',
              description: e.toString(),
            );
          },
        );
      },
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Image Upload Area
          // Image Upload Area
          ImagePickerField(
            pickedImage: state.pickedImage,
            onPickImage: _pickImage,
            onRemoveImage: () => ref
                .read(createPostControllerProvider.notifier)
                .setPickedImage(null),
          ),
          const SizedBox(height: 32),

          // Tags Section
          CategorySelector(
            selectedIds: state.categoryIds,
            onChanged: (String id) => ref
                .read(createPostControllerProvider.notifier)
                .toggleCategory(id),
          ),
          const SizedBox(height: 32),

          // Details Section
          // Details Section
          PostDescriptionField(
            controller: _descriptionController,
            onChanged: (String value) => ref
                .read(createPostControllerProvider.notifier)
                .setDescription(value),
          ),
          const SizedBox(height: 24),

          // Pricing Section
          // Pricing Section
          PostPricingField(
            controller: _priceController,
            onChanged: (String value) {
              final double? price = double.tryParse(value);
              if (price != null) {
                ref.read(createPostControllerProvider.notifier).setPrice(price);
              }
            },
          ),
          const SizedBox(height: 24),

          const SizedBox(height: 24),

          // Publish Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: AppButton(
              text: 'Publish Now',
              onPressed: (state.isValid && !state.status.isLoading)
                  ? _publish
                  : null,
              isLoading: state.status.isLoading,
              icon: LucideIcons.arrowRight,
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
