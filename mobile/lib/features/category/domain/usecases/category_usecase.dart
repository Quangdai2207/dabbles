import '../../../../core/network/api_response.dart';
import '../entities/category_entity.dart';
import '../repositories/category_repository.dart';

class GetAllCategoriesUseCase {
  GetAllCategoriesUseCase(this._repository);

  final CategoryRepository _repository;

  Future<ApiResponseObject<List<CategoryEntity>>> call() {
    return _repository.getAllCategories();
  }
}
