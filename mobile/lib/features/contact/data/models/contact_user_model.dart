import 'package:json_annotation/json_annotation.dart';

import '../../domain/entities/contact_user_entity.dart';

part 'contact_user_model.g.dart';

@JsonSerializable()
class ContactUserModel extends ContactUserEntity {
  const ContactUserModel({
    required super.id,
    required super.username,
    required super.name, // Display name
    required super.avatar,
    super.followStatus,
  });

  factory ContactUserModel.fromJson(Map<String, dynamic> json) {
    // Determine the ID field (id or userId)
    final String id = json['id'] as String? ?? json['userId'] as String? ?? '';

    // Construct name from firstName and lastName if name is not present, or use name if available
    String name = json['name'] as String? ?? '';
    if (name.isEmpty) {
      final String firstName = json['firstName'] as String? ?? '';
      final String lastName = json['lastName'] as String? ?? '';
      name = '$firstName $lastName'.trim();
      if (name.isEmpty) name = json['username'] as String? ?? '';
    }

    return ContactUserModel(
      id: id,
      username: json['username'] as String? ?? '',
      name: name,
      avatar: json['avatar'] as String? ?? '',
      followStatus: json['followStatus'] as String?,
    );
  }

  Map<String, dynamic> toJson() => _$ContactUserModelToJson(this);
}
