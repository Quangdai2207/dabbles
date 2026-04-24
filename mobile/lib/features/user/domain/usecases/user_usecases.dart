import '../../../../core/network/api_response.dart';
import '../entities/user_basic_entity.dart';
import '../entities/user_entity.dart';
import '../repositories/user_repository.dart';

class GetUserProfileUseCase {
  GetUserProfileUseCase(this._repository);
  final UserRepository _repository;

  Future<ApiResponseObject<UserEntity>> call(String? userId) {
    return _repository.getUserProfile(userId);
  }
}

class SearchUsersUseCase {
  SearchUsersUseCase(this._repository);
  final UserRepository _repository;

  Future<ApiResponseObject<List<UserBasicEntity>>> call(String query) {
    return _repository.searchUsers(query);
  }
}

class UpdateProfileUseCase {
  UpdateProfileUseCase(this._repository);
  final UserRepository _repository;

  Future<ApiResponseObject<UserEntity>> call({
    required Map<String, dynamic> data,
    String? avatarPath,
  }) {
    return _repository.updateProfile(data: data, avatarPath: avatarPath);
  }
}

class ChangePasswordUseCase {
  ChangePasswordUseCase(this._repository);
  final UserRepository _repository;

  Future<ApiResponseStatus> call(String currentPassword, String newPassword) {
    return _repository.changePassword(currentPassword, newPassword);
  }
}

class TogglePrivacyUseCase {
  TogglePrivacyUseCase(this._repository);
  final UserRepository _repository;

  Future<ApiResponseStatus> call() {
    return _repository.togglePrivacy();
  }
}
