import '../../../../core/network/api_response.dart';
import '../entities/user_basic_entity.dart';
import '../entities/user_entity.dart';

abstract class UserRepository {
  Future<ApiResponseObject<UserEntity>> getUserProfile(String? userId);
  Future<ApiResponseObject<List<UserBasicEntity>>> searchUsers(String query);
  Future<ApiResponseObject<UserEntity>> updateProfile({
    required Map<String, dynamic> data,
    String? avatarPath,
  });
  Future<ApiResponseStatus> changePassword(
    String currentPassword,
    String newPassword,
  );
  Future<ApiResponseStatus> togglePrivacy();
}
