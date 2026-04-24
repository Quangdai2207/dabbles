import 'package:dabble/core/network/api_response.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../features/auth/domain/entities/profile_entity.dart';
import '../../../../features/auth/injection/auth_injection.dart';
import '../controllers/library_controller.dart';
import '../states/library_screen_state.dart';

final FutureProvider<ProfileEntity?> authProfileProvider =
    FutureProvider<ProfileEntity?>((Ref ref) async {
      final ApiResponseObject<ProfileEntity> response = await ref
          .read(getProfileUseCaseProvider)
          .call();
      return response.isSuccess ? response.data : null;
    });

final StateNotifierProvider<LibraryController, LibraryScreenState>
libraryControllerProvider =
    StateNotifierProvider<LibraryController, LibraryScreenState>((Ref ref) {
      return LibraryController(ref);
    });
