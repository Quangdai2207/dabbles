import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/create_post_controller.dart';
import '../states/create_post_state.dart';

final StateNotifierProvider<CreatePostController, CreatePostState>
createPostControllerProvider =
    StateNotifierProvider<CreatePostController, CreatePostState>((Ref ref) {
      return CreatePostController(ref);
    });
