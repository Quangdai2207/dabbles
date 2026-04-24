import 'dart:io';

import 'package:dio/dio.dart' as dio;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http_parser/http_parser.dart';

import '../../../core/network/api_response.dart';
import '../../../features/image/injection/image_injection.dart';
import '../../../shared/utils/image_converter.dart';
import '../states/create_post_state.dart';

class CreatePostController extends StateNotifier<CreatePostState> {
  CreatePostController(this._ref) : super(const CreatePostState());

  final Ref _ref;

  void setPickedImage(File? file) {
    state = state.copyWith(pickedImage: file, clearImage: file == null);
  }

  void setDescription(String description) {
    state = state.copyWith(description: description);
  }

  void setPrice(double price) {
    state = state.copyWith(price: price);
  }

  void toggleCategory(String categoryId) {
    final List<String> currentIds = List<String>.from(state.categoryIds);
    if (currentIds.contains(categoryId)) {
      currentIds.remove(categoryId);
    } else {
      currentIds.add(categoryId);
    }
    state = state.copyWith(categoryIds: currentIds);
  }

  Future<void> upload() async {
    if (!state.isValid) return;

    state = state.copyWith(status: const AsyncLoading<void>());

    try {
      final Map<String, dynamic> data = <String, dynamic>{
        'description': state.description,
        'price': state.price.toString(),
        'categoryIds': state.categoryIds.join(','),
      };

      final dio.FormData formData = dio.FormData.fromMap(data);

      File? imageToUpload = state.pickedImage;
      if (imageToUpload != null) {
        final File? converted = await ImageConverter.convertToJpg(
          imageToUpload.path,
        );
        if (converted != null) {
          imageToUpload = converted;
        }

        formData.files.add(
          MapEntry<String, dio.MultipartFile>(
            'file',
            await dio.MultipartFile.fromFile(
              imageToUpload.path,
              filename: 'post_image.jpg',
              contentType: MediaType('image', 'jpeg'),
            ),
          ),
        );
      }

      final ApiResponseObject<void> result = await _ref
          .read(uploadImageUseCaseProvider)
          .call(formData);

      if (result.isSuccess) {
        state = state.copyWith(status: const AsyncData<void>(null));
      } else {
        final String errorMsg = result.errorMessage.isNotEmpty
            ? result.errorMessage
            : result.message;
        state = state.copyWith(
          status: AsyncError<void>(errorMsg, StackTrace.current),
        );
      }
    } catch (e, stack) {
      state = state.copyWith(status: AsyncError<void>(e, stack));
    }
  }

  void reset() {
    state = const CreatePostState();
  }
}
