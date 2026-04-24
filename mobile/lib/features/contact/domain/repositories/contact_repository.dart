import '../../../../core/network/api_response.dart';
import '../entities/contact_user_entity.dart';

abstract class ContactRepository {
  Future<ApiResponseObject<List<ContactUserEntity>>> getFollowers(
    String username,
  );
  Future<ApiResponseObject<List<ContactUserEntity>>> getFollowings(
    String username,
  );
  Future<ApiResponseObject<List<ContactUserEntity>>> getPending(
    String username,
  );
  Future<ApiResponseObject<List<ContactUserEntity>>> getBlocked();

  Future<ApiResponseStatus> handleRequest(String username, String type);
  Future<ApiResponseStatus> handleAction(String username, String type);
  Future<ApiResponseStatus> removeFollower(String username);
}
