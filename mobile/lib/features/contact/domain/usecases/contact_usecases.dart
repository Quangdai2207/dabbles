import '../../../../core/network/api_response.dart';
import '../entities/contact_user_entity.dart';
import '../repositories/contact_repository.dart';

class GetFollowersUseCase {
  GetFollowersUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseObject<List<ContactUserEntity>>> call(String username) {
    return _repository.getFollowers(username);
  }
}

class GetFollowingsUseCase {
  GetFollowingsUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseObject<List<ContactUserEntity>>> call(String username) {
    return _repository.getFollowings(username);
  }
}

class GetPendingUseCase {
  GetPendingUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseObject<List<ContactUserEntity>>> call(String username) {
    return _repository.getPending(username);
  }
}

class GetBlockedUseCase {
  GetBlockedUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseObject<List<ContactUserEntity>>> call() {
    return _repository.getBlocked();
  }
}

class HandleContactRequestUseCase {
  HandleContactRequestUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseStatus> call(String username, String type) {
    return _repository.handleRequest(username, type);
  }
}

class HandleContactActionUseCase {
  HandleContactActionUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseStatus> call(String username, String type) {
    return _repository.handleAction(username, type);
  }
}

class RemoveFollowerUseCase {
  RemoveFollowerUseCase(this._repository);
  final ContactRepository _repository;

  Future<ApiResponseStatus> call(String username) {
    return _repository.removeFollower(username);
  }
}
