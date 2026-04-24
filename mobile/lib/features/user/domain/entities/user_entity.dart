import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  const UserEntity({
    required this.id,
    required this.username,
    this.name,
    this.firstName,
    this.lastName,
    this.bio,
    this.avatar,
    this.phone,
    this.dob,
    this.isPrivate = false,
    this.follower = 0,
    this.following = 0,
    this.totalLike = 0,
    this.isFollowing = false,
    this.isFollower = false,
    this.isRequested = false,
  });

  final String id;
  final String username;
  final String? name;
  final String? firstName;
  final String? lastName;
  final String? bio;
  final String? avatar;
  final String? phone;
  final DateTime? dob;
  final bool isPrivate;
  final int follower;
  final int following;
  final int totalLike;
  final bool isFollowing;
  final bool isFollower;
  final bool isRequested;

  @override
  List<Object?> get props => <Object?>[
    id,
    username,
    firstName,
    lastName,
    bio,
    avatar,
    phone,
    dob,
    isPrivate,
    follower,
    following,
    totalLike,
    isFollowing,
    isFollower,
    isRequested,
  ];

  UserEntity copyWith({
    String? id,
    String? username,
    String? name,
    String? firstName,
    String? lastName,
    String? bio,
    String? avatar,
    String? phone,
    DateTime? dob,
    bool? isPrivate,
    int? follower,
    int? following,
    int? totalLike,
    bool? isFollowing,
    bool? isFollower,
    bool? isRequested,
  }) {
    return UserEntity(
      id: id ?? this.id,
      username: username ?? this.username,
      name: name ?? this.name,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      bio: bio ?? this.bio,
      avatar: avatar ?? this.avatar,
      phone: phone ?? this.phone,
      dob: dob ?? this.dob,
      isPrivate: isPrivate ?? this.isPrivate,
      follower: follower ?? this.follower,
      following: following ?? this.following,
      totalLike: totalLike ?? this.totalLike,
      isFollowing: isFollowing ?? this.isFollowing,
      isFollower: isFollower ?? this.isFollower,
      isRequested: isRequested ?? this.isRequested,
    );
  }
}
