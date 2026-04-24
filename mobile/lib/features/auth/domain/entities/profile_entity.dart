import 'package:equatable/equatable.dart';

class ProfileEntity with EquatableMixin {
  const ProfileEntity({
    required this.id,
    required this.email,
    required this.username,
    this.firstName,
    this.lastName,
    this.avatar,
    this.bio,
    this.public = true,
    this.phone,
    this.dob,
    this.expiredDay,
    this.warning,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String email;
  final String username;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final String? bio;
  final bool public;
  final String? phone;
  final String? dob;
  final String? expiredDay;
  final int? warning;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  @override
  List<Object?> get props => <Object?>[
    id,
    email,
    username,
    firstName,
    lastName,
    avatar,
    bio,
    public,
    phone,
    dob,
    expiredDay,
    warning,
    createdAt,
    updatedAt,
  ];

  ProfileEntity copyWith({
    String? id,
    String? email,
    String? username,
    Object? firstName = _sentinel,
    Object? lastName = _sentinel,
    Object? avatar = _sentinel,
    Object? bio = _sentinel,
    bool? public,
    Object? phone = _sentinel,
    Object? dob = _sentinel,
    Object? expiredDay = _sentinel,
    Object? warning = _sentinel,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProfileEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      firstName: firstName == _sentinel
          ? this.firstName
          : (firstName as String?),
      lastName: lastName == _sentinel ? this.lastName : (lastName as String?),
      avatar: avatar == _sentinel ? this.avatar : (avatar as String?),
      bio: bio == _sentinel ? this.bio : (bio as String?),
      public: public ?? this.public,
      phone: phone == _sentinel ? this.phone : (phone as String?),
      dob: dob == _sentinel ? this.dob : (dob as String?),
      expiredDay: expiredDay == _sentinel
          ? this.expiredDay
          : (expiredDay as String?),
      warning: warning == _sentinel ? this.warning : (warning as int?),
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  static const Object _sentinel = Object();

  String get fullName {
    if (firstName == null && lastName == null) return username;
    return '${firstName ?? ''} ${lastName ?? ''}'.trim();
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'email': email,
      'username': username,
      'firstName': firstName,
      'lastName': lastName,
      'avatar': avatar,
      'bio': bio,
      'public': public,
      'phone': phone,
      'dob': dob,
      'expiredDay': expiredDay,
      'warning': warning,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  @override
  String toString() => toJson().toString();
}
