import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../../domain/entities/comment_entity.dart';
import '../../domain/entities/image_entity.dart';
import '../../domain/repositories/image_repository.dart';
import '../datasources/remote/image_remote_datasource.dart';
import '../models/comment_model.dart';
import '../models/image_model.dart';

class ImageRepositoryImpl implements ImageRepository {
  ImageRepositoryImpl(this._remoteDataSource);
  final ImageRemoteDataSource _remoteDataSource;

  // Helper to map List Model to List Entity
  Future<ApiResponseObject<List<ImageEntity>>> _mapList(
    Future<ApiResponseObject<List<ImageModel>>> call,
  ) async {
    final ApiResponseObject<List<ImageModel>> response = await call;
    if (response.isSuccess) {
      return ApiResponseObject<List<ImageEntity>>(
        isSuccess: true,
        data: response.data,
      );
    }
    return ApiResponseObject<List<ImageEntity>>.error(response.errorMessage);
  }

  // Helper to map Single Model to Entity
  Future<ApiResponseObject<ImageEntity>> _mapSingle(
    Future<ApiResponseObject<ImageModel>> call,
  ) async {
    final ApiResponseObject<ImageModel> response = await call;
    if (response.isSuccess) {
      return ApiResponseObject<ImageEntity>(
        isSuccess: true,
        data: response.data, // Removed !
      );
    }
    return ApiResponseObject<ImageEntity>.error(response.errorMessage);
  }

  @override
  Future<ApiResponseStatus> commentImage({
    required String imageId,
    required String content,
    String? parentId,
  }) {
    return _remoteDataSource.commentImage(
      imageId: imageId,
      content: content,
      parentId: parentId,
    );
  }

  @override
  Future<ApiResponseObject<List<CommentEntity>>> getComments(
    String imageId,
  ) async {
    final ApiResponseObject<List<CommentModel>> response =
        await _remoteDataSource.getComments(imageId);
    if (response.isSuccess) {
      return ApiResponseObject<List<CommentEntity>>(
        isSuccess: true,
        data: response.data,
      );
    }
    return ApiResponseObject<List<CommentEntity>>.error(response.errorMessage);
  }

  @override
  Future<ApiResponseObject<List<ImageEntity>>> getHomeFeed({int page = 0}) {
    return _mapList(_remoteDataSource.getHomeFeed(page: page));
  }

  @override
  Future<ApiResponseObject<ImageEntity>> getImageById(String id) {
    return _mapSingle(_remoteDataSource.getImageById(id));
  }

  @override
  Future<ApiResponseObject<List<ImageEntity>>> getLikedImages({int page = 0}) {
    return _mapList(_remoteDataSource.getLikedImages(page: page));
  }

  @override
  Future<ApiResponseObject<List<ImageEntity>>> getPurchasedImages({
    int page = 0,
  }) {
    return _mapList(_remoteDataSource.getPurchasedImages(page: page));
  }

  @override
  Future<ApiResponseObject<List<ImageEntity>>> getUserImages(
    String username, {
    int page = 0,
  }) {
    return _mapList(_remoteDataSource.getUserImages(username, page: page));
  }

  @override
  Future<ApiResponseObject<List<ImageEntity>>> searchImages({
    int page = 0,
    String? keyword,
    String? category,
  }) {
    return _mapList(
      _remoteDataSource.getImages(
        page: page,
        keyword: keyword,
        category: category,
      ),
    );
  }

  @override
  Future<ApiResponseStatus> likeImage(String id) {
    return _remoteDataSource.likeImage(id);
  }

  @override
  Future<ApiResponseObject<ImageEntity>> updateImage({
    required String id,
    Map<String, dynamic>? data,
  }) {
    // Implement update logic if needed
    throw UnimplementedError();
  }

  @override
  Future<ApiResponseObject<ImageEntity>> uploadImage({
    required FormData formData,
  }) {
    return _mapSingle(_remoteDataSource.uploadImage(formData));
  }
}
