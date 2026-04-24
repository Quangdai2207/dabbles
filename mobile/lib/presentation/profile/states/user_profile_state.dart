import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/user/domain/entities/user_entity.dart';

class UserProfileState extends Equatable {
  const UserProfileState({
    this.profile = const AsyncValue<UserEntity?>.loading(),
  });

  final AsyncValue<UserEntity?> profile;

  UserProfileState copyWith({AsyncValue<UserEntity?>? profile}) {
    return UserProfileState(profile: profile ?? this.profile);
  }

  @override
  List<Object?> get props => <Object?>[profile];
}
