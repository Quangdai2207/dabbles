import '../../../../../core/network/api_response.dart';
import '../../domain/entities/contact_user_entity.dart';
import '../../domain/repositories/contact_repository.dart';
import '../datasources/remote/contact_remote_datasource.dart';
import '../models/contact_user_model.dart';

class ContactRepositoryImpl implements ContactRepository {
  ContactRepositoryImpl(this._remoteDataSource);
  final ContactRemoteDataSource _remoteDataSource;

  Future<ApiResponseObject<List<ContactUserEntity>>> _mapListResponse(
    Future<ApiResponseObject<List<ContactUserModel>>> call,
  ) async {
    final ApiResponseObject<List<ContactUserModel>> response = await call;
    if (response.isSuccess) {
      return ApiResponseObject<List<ContactUserEntity>>(
        isSuccess: true,
        data: response.data!,
      );
    }
    return ApiResponseObject<List<ContactUserEntity>>.error(
      response.errorMessage,
    );
  }

  @override
  Future<ApiResponseObject<List<ContactUserEntity>>> getBlocked() {
    return _mapListResponse(_remoteDataSource.getBlocked());
  }

  @override
  Future<ApiResponseObject<List<ContactUserEntity>>> getFollowers(
    String username,
  ) {
    return _mapListResponse(_remoteDataSource.getFollowers(username));
  }

  @override
  Future<ApiResponseObject<List<ContactUserEntity>>> getFollowings(
    String username,
  ) {
    return _mapListResponse(_remoteDataSource.getFollowings(username));
  }

  @override
  Future<ApiResponseObject<List<ContactUserEntity>>> getPending(
    String username,
  ) {
    return _mapListResponse(_remoteDataSource.getPending(username));
  }

  @override
  Future<ApiResponseStatus> handleAction(String username, String type) {
    return _remoteDataSource.handleAction(username, type);
  }

  @override
  Future<ApiResponseStatus> handleRequest(String username, String type) {
    return _remoteDataSource.handleRequest(username, type);
  }

  @override
  Future<ApiResponseStatus> removeFollower(String username) {
    return _remoteDataSource.removeFollower(username);
  }
}
