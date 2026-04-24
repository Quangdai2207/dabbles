import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/comment_model.dart';
import '../../models/image_model.dart';

class ImageRemoteDataSource {
  ImageRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<List<ImageModel>>> _getList(
    String url, {
    Map<String, dynamic>? params,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(url, queryParameters: params);

      // Handle pagination response wrapper
      final dynamic listData = response.data?['data'] is Map
          ? (response.data!['data'] as Map<String, dynamic>)['imageResponseDto']
          : response.data?['data']; // Fallback if API structure varies

      if (listData is List) {
        final List<ImageModel> list = listData
            .map((dynamic e) => ImageModel.fromJson(e as Map<String, dynamic>))
            .toList();
        return ApiResponseObject<List<ImageModel>>(isSuccess: true, data: list);
      }
      return ApiResponseObject<List<ImageModel>>(
        isSuccess: true,
        data: <ImageModel>[],
      );
    } on DioException catch (e) {
      return ApiResponseObject<List<ImageModel>>.error(
        (e.response?.data as Map<String, dynamic>?)?['errorMessage']
                as String? ??
            'Get images failed',
      );
    }
  }

  Future<ApiResponseObject<List<ImageModel>>> getHomeFeed({int page = 0}) {
    return _getList(
      ApiEndpoints.imageGetAll,
      params: <String, dynamic>{'page': page},
    );
  }

  Future<ApiResponseObject<List<ImageModel>>> getImages({
    int page = 0,
    String? keyword,
    String? category,
  }) {
    final Map<String, dynamic> params = <String, dynamic>{'page': page};
    if (keyword != null && keyword.isNotEmpty) {
      params['keyword'] = keyword;
    }
    if (category != null && category.isNotEmpty) {
      params['category'] = category;
    }
    return _getList(ApiEndpoints.imageGetAll, params: params);
  }

  Future<ApiResponseObject<ImageModel>> getImageById(String id) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.get(
        '${ApiEndpoints.imageGetById}/$id',
      );
      return ApiResponseObject<ImageModel>.fromJson(
        response.data!,
        (Object? json) => ImageModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      return ApiResponseObject<ImageModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get image failed',
      );
    }
  }

  Future<ApiResponseObject<List<ImageModel>>> getUserImages(
    String username, {
    int page = 0,
  }) {
    return _getList(
      '${ApiEndpoints.imageGetByUser}/$username',
      params: <String, dynamic>{'page': page},
    );
  }

  Future<ApiResponseObject<List<ImageModel>>> getPurchasedImages({
    int page = 0,
  }) {
    return _getList(
      ApiEndpoints.imageGetAllPurchased,
      params: <String, dynamic>{'page': page},
    );
  }

  Future<ApiResponseObject<List<ImageModel>>> getLikedImages({int page = 0}) {
    return _getList(
      ApiEndpoints.imageGetLiked,
      params: <String, dynamic>{'page': page},
    );
  }

  Future<ApiResponseStatus> likeImage(String id) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.imageLike,
        data: <String, String>{'imageId': id},
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Like failed',
      );
    }
  }

  Future<ApiResponseStatus> commentImage({
    required String imageId,
    required String content,
    String? parentId,
  }) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.imageComment,
        data: <String, dynamic>{
          'imageId': imageId,
          'content': content,
          'parentId': parentId,
        },
      );
      return ApiResponseStatus.fromJson(response.data!);
    } on DioException catch (e) {
      return ApiResponseStatus.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Comment failed',
      );
    }
  }

  Future<ApiResponseObject<List<CommentModel>>> getComments(
    String imageId,
  ) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.get(
        '${ApiEndpoints.imageGetComments}/$imageId',
      );

      return ApiResponseObject<List<CommentModel>>.fromJson(response.data!, (
        Object? json,
      ) {
        if (json is List) {
          return json
              .map(
                (dynamic e) => CommentModel.fromJson(e as Map<String, dynamic>),
              )
              .toList();
        }
        return <CommentModel>[];
      });
    } on DioException catch (e) {
      return ApiResponseObject<List<CommentModel>>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Get comments failed',
      );
    }
  }

  Future<ApiResponseObject<ImageModel>> uploadImage(FormData formData) async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient.post(
        ApiEndpoints.imageUpload,
        data: formData,
      );
      return ApiResponseObject<ImageModel>.fromJson(
        response.data!,
        (Object? json) => ImageModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      return ApiResponseObject<ImageModel>.error(
        (e.response?.data as Map<String, dynamic>?)?['message'] as String? ??
            'Upload failed',
      );
    }
  }
}
