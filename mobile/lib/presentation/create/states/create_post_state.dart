import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CreatePostState {
  const CreatePostState({
    this.pickedImage,
    this.description = '',
    this.price = 0.0,
    this.categoryIds = const <String>[],
    this.status = const AsyncData<void>(null),
  });

  final File? pickedImage;
  final String description;
  final double price;
  final List<String> categoryIds;
  final AsyncValue<void> status;

  CreatePostState copyWith({
    File? pickedImage,
    String? description,
    double? price,
    List<String>? categoryIds,
    AsyncValue<void>? status,
    bool clearImage = false,
  }) {
    return CreatePostState(
      pickedImage: clearImage ? null : (pickedImage ?? this.pickedImage),
      description: description ?? this.description,
      price: price ?? this.price,
      categoryIds: categoryIds ?? this.categoryIds,
      status: status ?? this.status,
    );
  }

  bool get isValid =>
      pickedImage != null && description.isNotEmpty && categoryIds.isNotEmpty;
}
