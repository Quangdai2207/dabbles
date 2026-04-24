import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/search_controller.dart';
import '../states/search_state.dart';
export '../controllers/search_controller.dart';

final StateNotifierProvider<SearchNotifier, SearchState> searchProvider =
    StateNotifierProvider<SearchNotifier, SearchState>((Ref ref) {
      return SearchNotifier(ref);
    });
