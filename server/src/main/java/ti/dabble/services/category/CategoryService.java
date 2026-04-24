package ti.dabble.services.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.entities.Category;
import ti.dabble.entities.ImageCategory;
import ti.dabble.entities.User;
import ti.dabble.entities.UserFollowedCategory;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.CategoryRepository;
import ti.dabble.repositories.ImageCategoryRepository;
import ti.dabble.repositories.UserFollowedCategoryRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.requests.CreateCategoryRequest;
import ti.dabble.requests.UpdateCategoryRequest;
import ti.dabble.response_status.StatusObject;

@Service
public class CategoryService implements ICategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserFollowedCategoryRepository userFollowedCategoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageCategoryRepository imageCategoryRepository;

    @Override
    public StatusObject<Integer> countCategories() {
        StatusObject<Integer> status = new StatusObject<>(false, "", "", 0);
        try {
            int countCategories = (int) categoryRepository.countCategories();
            status.setSuccess(true);
            status.setMessage(countCategories + " categories found");
            status.setData(countCategories);
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<List<Category>> getAllCategories() {
        StatusObject<List<Category>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<Category> categories = categoryRepository.findAllCategories();
            if (categories.isEmpty()) {
                statusObject.setMessage("No category found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all categories successfully");
            }
            statusObject.setData(categories);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<CategoryResponseDto>> getFollowedCategoriesByUser(String userEmail) {
        StatusObject<List<CategoryResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setMessage("No user found");
                return statusObject;
            }
            List<UserFollowedCategory> categories = userFollowedCategoryRepository.findByUserId(user.getId());

            List<CategoryResponseDto> categoryResponseDtos = categories.stream().map(
                            (category) -> FileMapper.getCategoryResponseDto(category.getCategory()))
                    .toList();
            if (categories.isEmpty()) {
                statusObject.setMessage("There is no followed category for this user");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all categories successfully");
            }
            statusObject.setData(categoryResponseDtos);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Category> getCategoryById(String categoryId) {
        StatusObject<Category> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Category Category = categoryRepository.findCategoryById(UUID.fromString(categoryId));
            if (Category == null) {
                statusObject.setMessage("No Category found");

            } else {
                statusObject.setSuccess(true);
                statusObject.setMessage("Get all Category successfully");
            }
            statusObject.setData(Category);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Category> createCategory(CreateCategoryRequest createCategoryRequest) {

        StatusObject<Category> statusObject = new StatusObject<>(false, "", "", null);
        try {
            boolean existingCategory = categoryRepository.existsByNameIgnoreCaseAndIsDeletedFalse(createCategoryRequest.getName());
            if (existingCategory) {
                statusObject.setErrorMessage("Category already exists");
                return statusObject;
            }
            Category category = new Category();
            category.setName(createCategoryRequest.getName());
            category.setDescription(createCategoryRequest.getDescription());
            category.setFeatured(createCategoryRequest.isFeatured());
            category.setSlug(FileHelper.generateSlug(createCategoryRequest.getName()));
            categoryRepository.save(category);
            statusObject.setSuccess(true);
            statusObject.setMessage("Create category successfully");
            statusObject.setData(category);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Category> updateCategory(UpdateCategoryRequest updateCategoryRequest, String categoryId) {
        StatusObject<Category> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Category existingCategory = categoryRepository.findCategoryById(UUID.fromString(categoryId));
            if (existingCategory == null) {
                statusObject.setMessage("No Category found");
                return statusObject;
            }
            existingCategory.setName(updateCategoryRequest.getName());
            existingCategory.setDescription(updateCategoryRequest.getDescription());
            existingCategory.setFeatured(updateCategoryRequest.isFeatured());

            categoryRepository.save(existingCategory);
            statusObject.setSuccess(true);
            statusObject.setMessage("Create category successfully");
            statusObject.setData(existingCategory);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Transactional
    @Override
    public StatusObject<Category> deleteCategory(String categoryId) {

        StatusObject<Category> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Category existingCategory = categoryRepository.findCategoryById(UUID.fromString(categoryId));
            if (existingCategory == null) {
                statusObject.setMessage("No Category found");
                return statusObject;
            }
            List<ImageCategory> imageCategories = imageCategoryRepository.findImageCategoriesByCategoryId(existingCategory.getId());
            if (!imageCategories.isEmpty()) {
                imageCategoryRepository.deleteAll(imageCategories);
            }
            List<UserFollowedCategory> userFollowedCategories = userFollowedCategoryRepository.findByCategoryId(existingCategory.getId());
            if (!userFollowedCategories.isEmpty()) {
                userFollowedCategoryRepository.deleteAll(userFollowedCategories);
            }
            existingCategory.setDeleted(true);

            categoryRepository.save(existingCategory);
            statusObject.setSuccess(true);
            statusObject.setMessage("Delete category successfully");
            statusObject.setData(existingCategory);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

}
