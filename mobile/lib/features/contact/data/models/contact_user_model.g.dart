// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ContactUserModel _$ContactUserModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ContactUserModel', json, ($checkedConvert) {
      final val = ContactUserModel(
        id: $checkedConvert('id', (v) => v as String),
        username: $checkedConvert('username', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        avatar: $checkedConvert('avatar', (v) => v as String),
        followStatus: $checkedConvert('followStatus', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$ContactUserModelToJson(ContactUserModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'name': instance.name,
      'avatar': instance.avatar,
      'followStatus': ?instance.followStatus,
    };
