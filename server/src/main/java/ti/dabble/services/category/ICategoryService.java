package ti.dabble.services.category;

import java.util.List;

import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.entities.Category;
import ti.dabble.requests.CreateCategoryRequest;
import ti.dabble.requests.UpdateCategoryRequest;
import ti.dabble.response_status.StatusObject;

public interface ICategoryService {
    StatusObject<List<Category>> getAllCategories();

    StatusObject<Category> getCategoryById(String id);

    StatusObject<Category> createCategory(CreateCategoryRequest createCategoryRequest);

    StatusObject<Category> updateCategory(UpdateCategoryRequest updateCategoryRequest, String categoryId);

    StatusObject<Category> deleteCategory(String categoryId);

    StatusObject<List<CategoryResponseDto>> getFollowedCategoriesByUser(String userEmail);

    StatusObject<Integer> countCategories();
}
