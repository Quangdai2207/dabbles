// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProfileModel _$ProfileModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ProfileModel', json, ($checkedConvert) {
      final val = ProfileModel(
        id: $checkedConvert('id', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String),
        username: $checkedConvert('username', (v) => v as String),
        firstName: $checkedConvert(
          'firstName',
          (v) => v as String?,
          readValue: _readFirstName,
        ),
        lastName: $checkedConvert(
          'lastName',
          (v) => v as String?,
          readValue: _readLastName,
        ),
        avatar: $checkedConvert('avatar', (v) => v as String?),
        bio: $checkedConvert('bio', (v) => v as String?),
        public: $checkedConvert('public', (v) => v as bool? ?? true),
        phone: $checkedConvert('phone', (v) => v as String?),
        dob: $checkedConvert('dob', (v) => v as String?, readValue: _readDob),
        expiredDay: $checkedConvert('expiredDay', (v) => v as String?),
        warning: $checkedConvert('warning', (v) => (v as num?)?.toInt()),
        createdAt: $checkedConvert(
          'createdAt',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        updatedAt: $checkedConvert(
          'updatedAt',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$ProfileModelToJson(ProfileModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'username': instance.username,
      'firstName': ?instance.firstName,
      'lastName': ?instance.lastName,
      'avatar': ?instance.avatar,
      'bio': ?instance.bio,
      'public': instance.public,
      'phone': ?instance.phone,
      'dob': ?instance.dob,
      'expiredDay': ?instance.expiredDay,
      'warning': ?instance.warning,
      'createdAt': ?instance.createdAt?.toIso8601String(),
      'updatedAt': ?instance.updatedAt?.toIso8601String(),
    };
