import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user_basic_entity.dart';

part 'user_basic_model.g.dart';

@JsonSerializable()
class UserBasicModel extends UserBasicEntity {
  const UserBasicModel({
    required super.id,
    required super.username,
    required super.name,
    super.avatar,
  });

  factory UserBasicModel.fromJson(Map<String, dynamic> json) =>
      _$UserBasicModelFromJson(json);

  Map<String, dynamic> toJson() => _$UserBasicModelToJson(this);
}
