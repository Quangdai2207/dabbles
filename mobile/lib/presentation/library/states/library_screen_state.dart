import 'package:equatable/equatable.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/user/domain/entities/user_entity.dart';

class LibraryScreenState extends Equatable {
  const LibraryScreenState({
    this.userProfile = const AsyncValue<UserEntity?>.loading(),
  });

  final AsyncValue<UserEntity?> userProfile;

  LibraryScreenState copyWith({AsyncValue<UserEntity?>? userProfile}) {
    return LibraryScreenState(userProfile: userProfile ?? this.userProfile);
  }

  @override
  List<Object?> get props => <Object?>[userProfile];
}
