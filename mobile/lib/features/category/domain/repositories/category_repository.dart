import '../../../../core/network/api_response.dart';
import '../entities/category_entity.dart';

abstract class CategoryRepository {
  Future<ApiResponseObject<List<CategoryEntity>>> getAllCategories();
}
