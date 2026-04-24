// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => $checkedCreate(
  'UserModel',
  json,
  ($checkedConvert) {
    final val = UserModel(
      id: $checkedConvert('id', (v) => v as String),
      username: $checkedConvert('username', (v) => v as String),
      name: $checkedConvert('name', (v) => v as String?),
      firstName: $checkedConvert('firstName', (v) => v as String?),
      lastName: $checkedConvert('lastName', (v) => v as String?),
      bio: $checkedConvert('bio', (v) => v as String?),
      avatar: $checkedConvert('avatar', (v) => v as String?),
      phone: $checkedConvert('phone', (v) => v as String?),
      dob: $checkedConvert(
        'dob',
        (v) => v == null ? null : DateTime.parse(v as String),
      ),
      isPrivate: $checkedConvert('isPrivate', (v) => v as bool? ?? false),
      follower: $checkedConvert('follower', (v) => (v as num?)?.toInt() ?? 0),
      following: $checkedConvert('following', (v) => (v as num?)?.toInt() ?? 0),
      totalLike: $checkedConvert('totalLike', (v) => (v as num?)?.toInt() ?? 0),
      isFollowing: $checkedConvert('isFollowing', (v) => v as bool? ?? false),
      isFollower: $checkedConvert('isFollower', (v) => v as bool? ?? false),
      isRequested: $checkedConvert('isRequested', (v) => v as bool? ?? false),
    );
    return val;
  },
);

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
  'id': instance.id,
  'username': instance.username,
  'name': ?instance.name,
  'firstName': ?instance.firstName,
  'lastName': ?instance.lastName,
  'bio': ?instance.bio,
  'avatar': ?instance.avatar,
  'phone': ?instance.phone,
  'dob': ?instance.dob?.toIso8601String(),
  'isPrivate': instance.isPrivate,
  'follower': instance.follower,
  'following': instance.following,
  'totalLike': instance.totalLike,
  'isFollowing': instance.isFollowing,
  'isFollower': instance.isFollower,
  'isRequested': instance.isRequested,
};
