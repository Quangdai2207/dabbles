import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../controllers/home_feed_controller.dart';
import '../states/home_feed_state.dart';
export '../controllers/home_feed_controller.dart';

final AsyncNotifierProvider<HomeFeedNotifier, HomeFeedState> homeFeedProvider =
    AsyncNotifierProvider<HomeFeedNotifier, HomeFeedState>(
      HomeFeedNotifier.new,
    );
