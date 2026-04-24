import 'package:equatable/equatable.dart';

class UserBasicEntity extends Equatable {
  const UserBasicEntity({
    required this.id,
    required this.username,
    required this.name,
    this.avatar,
  });

  final String id;
  final String username;
  final String name;
  final String? avatar;

  @override
  List<Object?> get props => <Object?>[id, username, name, avatar];
}
