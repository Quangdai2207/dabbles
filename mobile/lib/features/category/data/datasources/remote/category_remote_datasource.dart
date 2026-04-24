import 'package:dio/dio.dart';

import '../../../../../core/network/api_client.dart';
import '../../../../../core/network/api_response.dart';
import '../../../../../shared/constants/api_endpoints.dart';
import '../../models/category_model.dart';

class CategoryRemoteDataSource {
  CategoryRemoteDataSource(this._apiClient);
  final ApiClient _apiClient;

  Future<ApiResponseObject<List<CategoryModel>>> getAllCategories() async {
    try {
      final Response<Map<String, dynamic>> response = await _apiClient
          .get<Map<String, dynamic>>(ApiEndpoints.categoryGetAll);

      return ApiResponseObject<List<CategoryModel>>.fromJson(response.data!, (
        Object? json,
      ) {
        if (json is List) {
          return json
              .map(
                (Object? e) =>
                    CategoryModel.fromJson(e as Map<String, dynamic>),
              )
              .toList();
        }
        return <CategoryModel>[];
      });
    } on DioException catch (e) {
      final dynamic responseData = e.response?.data;
      final String errorMsg = responseData is Map<String, dynamic>
          ? (responseData['errorMessage'] as String?) ??
                'Get all categories failed'
          : 'Get all categories failed';
      return ApiResponseObject<List<CategoryModel>>.error(errorMsg);
    }
  }
}
