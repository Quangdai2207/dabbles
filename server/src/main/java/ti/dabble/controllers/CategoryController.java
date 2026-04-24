package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import ti.dabble.dtos.CategoryResponseDto;
import ti.dabble.entities.Category;
import ti.dabble.requests.CreateCategoryRequest;
import ti.dabble.requests.UpdateCategoryRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.category.ICategoryService;

@RestController
@RequestMapping("/api/category")
class CategoryController {
    @Autowired
    private ICategoryService categoryService;

    @GetMapping(value = "/get-all-categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<Category>>> getAllCategories() {
        StatusObject<List<Category>> status = categoryService.getAllCategories();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/get-category-by-id/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Category>> getCategoryById(@PathVariable("categoryId") String categoryId) {
        StatusObject<Category> status = categoryService.getCategoryById(categoryId);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/get-followed-categories-by-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<CategoryResponseDto>>> getFollowedCategoriesByUser(Authentication authentication) {
        StatusObject<List<CategoryResponseDto>> status = categoryService.getFollowedCategoriesByUser(authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }


    @PostMapping(value = "/create-category", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Category>> createCategory(@Valid @RequestBody CreateCategoryRequest createCategoryRequest) {
        StatusObject<Category> status = categoryService.createCategory(createCategoryRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(value = "/update-category/{categoryId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Category>> createCategory(@PathVariable("categoryId") String categoryId, @Valid @RequestBody UpdateCategoryRequest updateCategoryRequest) {
        StatusObject<Category> status = categoryService.updateCategory(updateCategoryRequest, categoryId);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @DeleteMapping(value = "/delete-category/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Category>> deleteCategory(@PathVariable("categoryId") String categoryId) {
        StatusObject<Category> status = categoryService.deleteCategory(categoryId);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }
}
