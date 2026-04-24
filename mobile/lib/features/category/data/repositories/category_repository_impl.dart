import '../../../../../core/network/api_response.dart';
import '../../domain/entities/category_entity.dart';
import '../../domain/repositories/category_repository.dart';
import '../datasources/remote/category_remote_datasource.dart';
import '../models/category_model.dart';

class CategoryRepositoryImpl implements CategoryRepository {
  CategoryRepositoryImpl(this._remoteDataSource);

  final CategoryRemoteDataSource _remoteDataSource;

  @override
  Future<ApiResponseObject<List<CategoryEntity>>> getAllCategories() async {
    final ApiResponseObject<List<CategoryModel>> response =
        await _remoteDataSource.getAllCategories();
    if (response.isSuccess) {
      return ApiResponseObject<List<CategoryEntity>>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<List<CategoryEntity>>.error(response.errorMessage);
  }
}
