import 'package:json_annotation/json_annotation.dart';

// ignore_for_file: invalid_annotation_target

import '../../domain/entities/profile_entity.dart';

part 'auth_model.g.dart';

@JsonSerializable()
class ProfileModel extends ProfileEntity {
  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileModelFromJson(json);

  const ProfileModel({
    required super.id,
    required super.email,
    required super.username,
    @JsonKey(name: 'firstName', readValue: _readFirstName) super.firstName,
    @JsonKey(name: 'lastName', readValue: _readLastName) super.lastName,
    super.avatar,
    super.bio,
    super.public = true,
    super.phone,
    @JsonKey(name: 'dob', readValue: _readDob) super.dob,
    @JsonKey(name: 'expiredDay') super.expiredDay,
    super.warning,
    @JsonKey(name: 'createdAt') super.createdAt,
    @JsonKey(name: 'updatedAt') super.updatedAt,
  });

  @override
  Map<String, dynamic> toJson() => _$ProfileModelToJson(this);
}

Object? _readDob(Map<dynamic, dynamic> map, String key) {
  return map['dob'] ??
      map['dateOfBirth'] ??
      map['date_of_birth'] ??
      map['birth_date'];
}

Object? _readFirstName(Map<dynamic, dynamic> map, String key) {
  return map['firstName'] ?? map['first_name'];
}

Object? _readLastName(Map<dynamic, dynamic> map, String key) {
  return map['lastName'] ?? map['last_name'];
}
