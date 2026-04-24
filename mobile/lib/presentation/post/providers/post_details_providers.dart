import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/post_details_controller.dart';
import '../states/post_details_state.dart';

final AutoDisposeStateNotifierProviderFamily<
  PostDetailsController,
  PostDetailsState,
  String
>
postDetailsControllerProvider = StateNotifierProvider.autoDispose
    .family<PostDetailsController, PostDetailsState, String>((
      Ref ref,
      String imageId,
    ) {
      return PostDetailsController(ref, imageId);
    });
