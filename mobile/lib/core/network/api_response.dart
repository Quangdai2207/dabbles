class ApiResponseStatus {
  const ApiResponseStatus({
    required this.isSuccess,
    this.message = '',
    this.errorMessage = '',
    this.statusCode,
  });

  factory ApiResponseStatus.fromJson(
    Map<String, dynamic> json, {
    int? statusCode,
  }) {
    return ApiResponseStatus(
      isSuccess: (json['isSuccess'] as bool?) ?? true,
      message: (json['message'] as String?) ?? '',
      errorMessage: (json['errorMessage'] as String?) ?? '',
      statusCode: statusCode,
    );
  }

  factory ApiResponseStatus.error(String errorMessage, {int? statusCode}) {
    return ApiResponseStatus(
      isSuccess: false,
      errorMessage: errorMessage,
      statusCode: statusCode,
    );
  }

  final bool isSuccess;
  final String message;
  final String errorMessage;
  final int? statusCode;
}

class ApiResponseObject<T> extends ApiResponseStatus {
  const ApiResponseObject({
    required super.isSuccess,
    super.message = '',
    super.errorMessage = '',
    super.statusCode,
    this.data,
  });

  factory ApiResponseObject.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json)? fromJsonT, {
    int? statusCode,
  }) {
    final dynamic rawData = json['data'];
    T? data;
    if (rawData != null && fromJsonT != null) {
      data = fromJsonT(rawData);
    } else if (rawData is T) {
      data = rawData;
    }
    return ApiResponseObject<T>(
      isSuccess: (json['isSuccess'] as bool?) ?? true,
      message: (json['message'] as String?) ?? '',
      errorMessage: (json['errorMessage'] as String?) ?? '',
      statusCode: statusCode,
      data: data,
    );
  }

  factory ApiResponseObject.error(String errorMessage, {int? statusCode}) {
    return ApiResponseObject<T>(
      isSuccess: false,
      errorMessage: errorMessage,
      statusCode: statusCode,
    );
  }

  final T? data;
}

class ApiAuthResponse extends ApiResponseStatus {
  const ApiAuthResponse({
    required super.isSuccess,
    super.message = '',
    super.errorMessage = '',
    super.statusCode,
    required this.token,
    required this.accountId,
    required this.expires,
  });

  factory ApiAuthResponse.fromJson(
    Map<String, dynamic> json, {
    int? statusCode,
  }) {
    return ApiAuthResponse(
      isSuccess: (json['isSuccess'] as bool?) ?? true,
      message: (json['message'] as String?) ?? '',
      errorMessage: (json['errorMessage'] as String?) ?? '',
      statusCode: statusCode,
      token: (json['token'] as String?) ?? '',
      accountId: (json['accountId'] as String?) ?? '',
      expires: (json['expires'] as int?) ?? 0,
    );
  }

  factory ApiAuthResponse.error(String errorMessage, {int? statusCode}) {
    return ApiAuthResponse(
      isSuccess: false,
      errorMessage: errorMessage,
      statusCode: statusCode,
      token: '',
      accountId: '',
      expires: 0,
    );
  }

  final String token;
  final String accountId;
  final int expires;
}
