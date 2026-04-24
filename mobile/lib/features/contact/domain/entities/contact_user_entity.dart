import 'package:equatable/equatable.dart';

class ContactUserEntity extends Equatable {
  const ContactUserEntity({
    required this.id, // Maps to 'userId' from API
    required this.username,
    required this.name,
    required this.avatar,
    this.followStatus,
  });

  final String id;
  final String username;
  final String name;
  final String avatar;
  final String? followStatus;

  @override
  List<Object?> get props => <Object?>[
    id,
    username,
    name,
    avatar,
    followStatus,
  ];
}
