import '../../../../../core/services/storage_service.dart';

abstract class AuthLocalDatasource {
  Future<void> saveToken({required String token});
  Future<String?> getToken();
  Future<void> deleteToken();
  Future<void> saveAccountId({required String accountId});
  Future<String?> getAccountId();
  Future<void> deleteAccountId();
  Future<bool> isLoggedIn();
  Future<void> clearAll();
}

class AuthLocalDatasourceImpl implements AuthLocalDatasource {
  AuthLocalDatasourceImpl({required StorageService storageService})
    : _storageService = storageService;
  final StorageService _storageService;

  static const String _accountIdKey = 'account_id';

  @override
  Future<void> saveToken({required String token}) async {
    await _storageService.saveToken(token);
  }

  @override
  Future<String?> getToken() async {
    return await _storageService.getToken();
  }

  @override
  Future<void> deleteToken() async {
    await _storageService.deleteToken();
  }

  @override
  Future<void> saveAccountId({required String accountId}) async {
    await _storageService.write(_accountIdKey, accountId);
  }

  @override
  Future<String?> getAccountId() async {
    return await _storageService.read(_accountIdKey);
  }

  @override
  Future<void> deleteAccountId() async {
    await _storageService.delete(_accountIdKey);
  }

  @override
  Future<bool> isLoggedIn() async {
    return await _storageService.isLoggedIn();
  }

  @override
  Future<void> clearAll() async {
    await _storageService.clearAll();
  }
}
