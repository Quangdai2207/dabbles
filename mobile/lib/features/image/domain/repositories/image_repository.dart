import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../entities/comment_entity.dart';
import '../entities/image_entity.dart';

abstract class ImageRepository {
  Future<ApiResponseObject<List<ImageEntity>>> getHomeFeed({int page = 0});

  Future<ApiResponseObject<ImageEntity>> getImageById(String id);

  Future<ApiResponseObject<List<ImageEntity>>> getUserImages(
    String username, {
    int page = 0,
  });

  Future<ApiResponseObject<List<ImageEntity>>> searchImages({
    int page = 0,
    String? keyword,
    String? category,
  });

  Future<ApiResponseObject<List<ImageEntity>>> getPurchasedImages({
    int page = 0,
  });

  Future<ApiResponseObject<List<ImageEntity>>> getLikedImages({int page = 0});

  Future<ApiResponseStatus> likeImage(String id);

  Future<ApiResponseStatus> commentImage({
    required String imageId,
    required String content,
    String? parentId,
  });

  Future<ApiResponseObject<List<CommentEntity>>> getComments(String imageId);

  Future<ApiResponseObject<ImageEntity>> uploadImage({
    required FormData formData, // Requires FormData for file upload
  });

  Future<ApiResponseObject<ImageEntity>> updateImage({
    required String id,
    Map<String, dynamic>? data,
  });
}
