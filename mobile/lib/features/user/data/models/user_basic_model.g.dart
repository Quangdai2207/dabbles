// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_basic_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserBasicModel _$UserBasicModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UserBasicModel', json, ($checkedConvert) {
      final val = UserBasicModel(
        id: $checkedConvert('id', (v) => v as String),
        username: $checkedConvert('username', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        avatar: $checkedConvert('avatar', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$UserBasicModelToJson(UserBasicModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'name': instance.name,
      'avatar': ?instance.avatar,
    };
