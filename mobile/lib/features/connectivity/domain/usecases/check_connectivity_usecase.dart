import '../entities/connectivity_entity.dart';
import '../repositories/connectivity_repository.dart';

class CheckConnectivityUseCase {
  CheckConnectivityUseCase(this._repository);
  final ConnectivityRepository _repository;

  Future<ConnectivityEntity> call() async {
    return await _repository.checkConnectivity();
  }
}
