import 'package:json_annotation/json_annotation.dart';

import '../../domain/entities/user_entity.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.username,
    super.name,
    super.firstName,
    super.lastName,
    super.bio,
    super.avatar,
    super.phone,
    super.dob,
    super.isPrivate,
    super.follower,
    super.following,
    super.totalLike,
    super.isFollowing,
    super.isFollower,
    super.isRequested,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    final String? followStatus = json['followStatus'] as String?;

    return UserModel(
      id: json['id'] as String,
      username: json['username'] as String,
      name: json['name'] as String?,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      bio: json['bio'] as String?,
      avatar: json['avatar'] as String?,
      phone: json['phone'] as String?,
      dob: json['dob'] == null ? null : DateTime.parse(json['dob'] as String),
      isPrivate: json['isPrivate'] as bool? ?? false,
      follower: json['follower'] as int? ?? 0,
      following: json['following'] as int? ?? 0,
      totalLike: json['totalLike'] as int? ?? 0,
      isFollowing:
          followStatus == 'ACCEPTED' || (json['isFollowing'] as bool? ?? false),
      isFollower: json['isFollower'] as bool? ?? false,
      isRequested:
          followStatus == 'PENDING' || (json['isRequested'] as bool? ?? false),
    );
  }

  Map<String, dynamic> toJson() => _$UserModelToJson(this);
}
