import 'package:dabble/core/providers/core_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/datasources/remote/image_remote_datasource.dart';
import '../data/repositories/image_repository_impl.dart';
import '../domain/repositories/image_repository.dart';
import '../domain/usecases/image_usecases.dart';

// Data Sources
final Provider<ImageRemoteDataSource> imageRemoteDataSourceProvider =
    Provider<ImageRemoteDataSource>((Ref ref) {
      return ImageRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repositories
final Provider<ImageRepository> imageRepositoryProvider =
    Provider<ImageRepository>((Ref ref) {
      return ImageRepositoryImpl(ref.watch(imageRemoteDataSourceProvider));
    });

// Use Cases
final Provider<GetHomeFeedUseCase> getHomeFeedUseCaseProvider =
    Provider<GetHomeFeedUseCase>((Ref ref) {
      return GetHomeFeedUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<GetUserImagesUseCase> getUserImagesUseCaseProvider =
    Provider<GetUserImagesUseCase>((Ref ref) {
      return GetUserImagesUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<GetImageByIdUseCase> getImageByIdUseCaseProvider =
    Provider<GetImageByIdUseCase>((Ref ref) {
      return GetImageByIdUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<LikeImageUseCase> likeImageUseCaseProvider =
    Provider<LikeImageUseCase>((Ref ref) {
      return LikeImageUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<CommentImageUseCase> commentImageUseCaseProvider =
    Provider<CommentImageUseCase>((Ref ref) {
      return CommentImageUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<GetCommentsUseCase> getCommentsUseCaseProvider =
    Provider<GetCommentsUseCase>((Ref ref) {
      return GetCommentsUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<UploadImageUseCase> uploadImageUseCaseProvider =
    Provider<UploadImageUseCase>((Ref ref) {
      return UploadImageUseCase(ref.watch(imageRepositoryProvider));
    });
final Provider<GetLikedImagesUseCase> getLikedImagesUseCaseProvider =
    Provider<GetLikedImagesUseCase>((Ref ref) {
      return GetLikedImagesUseCase(ref.watch(imageRepositoryProvider));
    });

final Provider<GetPurchasedImagesUseCase> getPurchasedImagesUseCaseProvider =
    Provider<GetPurchasedImagesUseCase>((Ref ref) {
      return GetPurchasedImagesUseCase(ref.watch(imageRepositoryProvider));
    });
