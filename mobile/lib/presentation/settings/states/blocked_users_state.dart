import 'package:dabble/features/contact/domain/entities/contact_user_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BlockedUsersState {
  const BlockedUsersState({
    this.status = const AsyncLoading<List<ContactUserEntity>>(),
  });

  final AsyncValue<List<ContactUserEntity>> status;

  BlockedUsersState copyWith({AsyncValue<List<ContactUserEntity>>? status}) {
    return BlockedUsersState(status: status ?? this.status);
  }
}
