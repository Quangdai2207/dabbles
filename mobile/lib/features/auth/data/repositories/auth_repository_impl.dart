import 'package:dio/dio.dart';

import '../../../../core/network/api_response.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/local/auth_local_datasource.dart';
import '../datasources/remote/auth_remote_datasource.dart';
import '../models/auth_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(this._remoteDatasource, this._localDatasource);
  final AuthRemoteDatasource _remoteDatasource;
  final AuthLocalDatasource _localDatasource;

  @override
  Future<ApiAuthResponse> login({
    required String email,
    required String password,
    required String captchaToken,
  }) async {
    final ApiAuthResponse response = await _remoteDatasource.login(
      email: email,
      password: password,
      captchaToken: captchaToken,
    );

    if (response.isSuccess) {
      await Future.wait<void>(<Future<void>>[
        _localDatasource.saveToken(token: response.token),
        _localDatasource.saveAccountId(accountId: response.accountId),
      ]);
    }

    return response;
  }

  @override
  Future<ApiAuthResponse> loginWithGoogle({required String idToken}) async {
    final ApiAuthResponse response = await _remoteDatasource.loginWithGoogle(
      idToken: idToken,
    );

    if (response.isSuccess) {
      await Future.wait<void>(<Future<void>>[
        _localDatasource.saveToken(token: response.token),
        _localDatasource.saveAccountId(accountId: response.accountId),
      ]);
    }

    return response;
  }

  @override
  Future<ApiResponseStatus> register({
    required String firstName,
    required String lastName,
    required String username,
    required String email,
    required String phone,
    required String password,
    required String passwordConfirm,
    required String dateOfBirth,
    required String captchaToken,
  }) async {
    return await _remoteDatasource.register(
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      phone: phone,
      password: password,
      passwordConfirm: passwordConfirm,
      dateOfBirth: dateOfBirth,
      captchaToken: captchaToken,
    );
  }

  @override
  Future<ApiResponseStatus> logout() async {
    final String? token = await _localDatasource.getToken();
    if (token == null) {
      return const ApiResponseStatus(
        isSuccess: true,
        message: 'Already logged out',
      );
    }

    final ApiResponseStatus response = await _remoteDatasource.logout(
      token: token,
    );
    await _localDatasource.clearAll();
    return response;
  }

  @override
  Future<ApiResponseStatus> checkValidToken() async {
    final String? token = await _localDatasource.getToken();
    if (token == null) {
      return const ApiResponseStatus(
        isSuccess: false,
        errorMessage: 'No token found',
      );
    }

    return await _remoteDatasource.checkValidToken(token: token);
  }

  @override
  Future<ApiResponseStatus> verifyAccount({required String token}) async {
    return await _remoteDatasource.verifyAccount(token: token);
  }

  @override
  Future<ApiResponseStatus> forgotPassword({required String email}) async {
    return await _remoteDatasource.forgotPassword(email: email);
  }

  @override
  Future<ApiResponseStatus> resetPassword({
    required String token,
    required String password,
    required String passwordConfirm,
  }) async {
    return await _remoteDatasource.resetPassword(
      token: token,
      password: password,
      passwordConfirm: passwordConfirm,
    );
  }

  @override
  Future<ApiResponseObject<ProfileModel>> getProfile() async {
    final bool isLoggedIn = await _localDatasource.isLoggedIn();
    if (!isLoggedIn) {
      return const ApiResponseObject<ProfileModel>(
        isSuccess: false,
        errorMessage: 'Not authenticated',
      );
    }

    final ApiResponseObject<Map<String, dynamic>> response =
        await _remoteDatasource.getProfile();

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<ProfileModel>(
        isSuccess: true,
        message: response.message,
        data: ProfileModel.fromJson(response.data!),
      );
    }

    if (!response.isSuccess) {
      await _localDatasource.clearAll();
    }

    return ApiResponseObject<ProfileModel>(
      isSuccess: response.isSuccess,
      message: response.message,
      errorMessage: response.errorMessage,
    );
  }

  @override
  Future<ApiResponseObject<ProfileModel>> updateProfile({
    required FormData formData,
  }) async {
    final bool isLoggedIn = await _localDatasource.isLoggedIn();
    if (!isLoggedIn) {
      return const ApiResponseObject<ProfileModel>(
        isSuccess: false,
        errorMessage: 'Not authenticated',
      );
    }

    final ApiResponseObject<Map<String, dynamic>> response =
        await _remoteDatasource.updateProfile(formData: formData);

    if (response.isSuccess && response.data != null) {
      return ApiResponseObject<ProfileModel>(
        isSuccess: true,
        message: response.message,
        data: ProfileModel.fromJson(response.data!),
      );
    }

    return ApiResponseObject<ProfileModel>(
      isSuccess: response.isSuccess,
      message: response.message,
      errorMessage: response.errorMessage,
    );
  }

  // Local datasource helper methods
  @override
  Future<bool> isLoggedIn() async {
    return await _localDatasource.isLoggedIn();
  }

  @override
  Future<String?> getToken() async {
    return await _localDatasource.getToken();
  }

  @override
  Future<String?> getAccountId() async {
    return await _localDatasource.getAccountId();
  }

  @override
  Future<void> clearAll() async {
    await _localDatasource.clearAll();
  }
}
