import 'package:dio/dio.dart' as dio;
import '../../../../core/network/api_response.dart';
import '../../domain/entities/user_basic_entity.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/user_repository.dart';
import '../datasources/remote/user_remote_datasource.dart';
import '../models/user_basic_model.dart';
import '../models/user_model.dart';

class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._remoteDataSource);
  final UserRemoteDataSource _remoteDataSource;

  // Helper to map Single Model to Entity
  Future<ApiResponseObject<UserEntity>> _mapSingle(
    Future<ApiResponseObject<UserModel>> call,
  ) async {
    final ApiResponseObject<UserModel> response = await call;
    if (response.isSuccess) {
      return ApiResponseObject<UserEntity>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<UserEntity>.error(response.errorMessage);
  }

  @override
  Future<ApiResponseStatus> changePassword(
    String currentPassword,
    String newPassword,
  ) {
    return _remoteDataSource.changePassword(currentPassword, newPassword);
  }

  @override
  Future<ApiResponseObject<UserEntity>> getUserProfile(String? userId) {
    return _mapSingle(_remoteDataSource.getUserProfile(userId));
  }

  @override
  Future<ApiResponseObject<List<UserBasicEntity>>> searchUsers(
    String query,
  ) async {
    final ApiResponseObject<List<UserBasicModel>> response =
        await _remoteDataSource.searchUsers(query);

    if (response.isSuccess) {
      return ApiResponseObject<List<UserBasicEntity>>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<List<UserBasicEntity>>.error(
      response.errorMessage,
    );
  }

  @override
  Future<ApiResponseStatus> togglePrivacy() {
    return _remoteDataSource.togglePrivacy();
  }

  @override
  Future<ApiResponseObject<UserEntity>> updateProfile({
    required Map<String, dynamic> data,
    String? avatarPath,
  }) async {
    Object requestData;
    if (avatarPath != null) {
      final dio.FormData formData = dio.FormData.fromMap(data);
      formData.files.add(
        MapEntry<String, dio.MultipartFile>(
          'avatar',
          await dio.MultipartFile.fromFile(avatarPath),
        ),
      );
      requestData = formData;
    } else {
      // If we want to mimic client exact behavior (always sending FormData)
      // we could check if backend requires it.
      // For now, let's stick to Map if no file, unless client REQUIRES FormData even for text.
      // Based on client code:
      /*
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value)
        })
      */
      // It seems the client ALWAYS sends FormData context-type.
      // So let's convert to FormData always to be safe and consistent with client.
      requestData = dio.FormData.fromMap(data);
    }
    return _mapSingle(_remoteDataSource.updateProfile(requestData));
  }
}
