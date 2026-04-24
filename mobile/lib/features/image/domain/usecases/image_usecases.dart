import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../entities/comment_entity.dart';
import '../entities/image_entity.dart';
import '../repositories/image_repository.dart';

class GetHomeFeedUseCase {
  GetHomeFeedUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<List<ImageEntity>>> call({int page = 0}) {
    return _repository.getHomeFeed(page: page);
  }
}

class GetImageByIdUseCase {
  GetImageByIdUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<ImageEntity>> call(String id) {
    return _repository.getImageById(id);
  }
}

class GetUserImagesUseCase {
  GetUserImagesUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<List<ImageEntity>>> call(
    String username, {
    int page = 0,
  }) {
    return _repository.getUserImages(username, page: page);
  }
}

class LikeImageUseCase {
  LikeImageUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseStatus> call(String id) {
    return _repository.likeImage(id);
  }
}

class CommentImageUseCase {
  CommentImageUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseStatus> call({
    required String imageId,
    required String content,
    String? parentId,
  }) {
    return _repository.commentImage(
      imageId: imageId,
      content: content,
      parentId: parentId,
    );
  }
}

class GetCommentsUseCase {
  GetCommentsUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<List<CommentEntity>>> call(String imageId) {
    return _repository.getComments(imageId);
  }
}

class UploadImageUseCase {
  UploadImageUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<ImageEntity>> call(FormData formData) {
    return _repository.uploadImage(formData: formData);
  }
}

class GetLikedImagesUseCase {
  GetLikedImagesUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<List<ImageEntity>>> call({int page = 0}) {
    return _repository.getLikedImages(page: page);
  }
}

class GetPurchasedImagesUseCase {
  GetPurchasedImagesUseCase(this._repository);
  final ImageRepository _repository;

  Future<ApiResponseObject<List<ImageEntity>>> call({int page = 0}) {
    return _repository.getPurchasedImages(page: page);
  }
}
