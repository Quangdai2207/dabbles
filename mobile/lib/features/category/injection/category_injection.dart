import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/remote/category_remote_datasource.dart';
import '../data/repositories/category_repository_impl.dart';
import '../domain/repositories/category_repository.dart';
import '../domain/usecases/category_usecase.dart';

// Data Sources
final Provider<CategoryRemoteDataSource> categoryRemoteDataSourceProvider =
    Provider<CategoryRemoteDataSource>((Ref ref) {
      return CategoryRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repositories
final Provider<CategoryRepository> categoryRepositoryProvider =
    Provider<CategoryRepository>((Ref ref) {
      return CategoryRepositoryImpl(
        ref.watch(categoryRemoteDataSourceProvider),
      );
    });

// Use Cases
final Provider<GetAllCategoriesUseCase> getAllCategoriesUseCaseProvider =
    Provider<GetAllCategoriesUseCase>((Ref ref) {
      return GetAllCategoriesUseCase(ref.watch(categoryRepositoryProvider));
    });
