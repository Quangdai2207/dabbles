class ApiEndpoints {
  ApiEndpoints._();

  // Auth
  static const String authLogin = '/auth/login';
  static const String authGoogleLogin = '/auth/google-login';
  static const String authSignup = '/auth/register';
  static const String authVerifyAccount = '/auth/verify-account';
  static const String authForgotPassword = '/auth/forgot-password';
  static const String authResetPassword = '/auth/reset-password';
  static const String authCheckValidToken = '/auth/check-valid-token';
  static const String authProfile = '/auth/profile';
  static const String authLogout = '/auth/logout';

  // Conversation
  static const String conversationGetConversations =
      '/conversation/conversation-of-user';
  static const String conversationFindConversation =
      '/conversation/find-existing-private-conversation';
  static const String conversationCreateConversation =
      '/conversation/create-conversation';
  static const String conversationTotalUnread =
      '/conversation/total-of-unread-conversation';
  static const String conversationDelete =
      '/conversation/delete-message-history-of-conversation';

  // Chat
  static const String chatSendMessage = '/chat/send-message';
  static const String chatGetMessages = '/chat/message-of-conversation';

  // User
  static const String userGetProfile = '/user/profile-user-with-image';
  static const String userUpdateProfile = '/user/update';
  static const String userChangePassword = '/user/change-password';
  static const String userTogglePrivacy = '/user/toggle-account-privacy';
  static const String userSearch = '/user/search-by-username';

  // Contact
  static const String contactFollowing = '/contact/get-all-followings-of-user';
  static const String contactFollowers = '/contact/get-all-followers-of-user';
  static const String contactPending = '/contact/get-all-pending-of-user';
  static const String contactHandleRequest =
      '/contact/follow-or-accept-or-deny';
  static const String contactHandleAction =
      '/contact/unfollow-or-block-or-unblock';
  static const String contactRemoveFollower = '/contact/remove-follower';
  static const String contactGetAllBlocked = '/contact/get-all-blocked-of-user';

  // Notification
  static const String notificationTotalUnread =
      '/notification/total-notification';
  static const String notificationGetNotifications =
      '/notification/get-all-notification';
  static const String notificationMarkReadAll =
      '/notification/mark-as-read-all-notifications';
  static const String notificationMarkRead =
      '/notification/mark-as-read-notification';
  static const String notificationRemove = '/notification/delete-notification';

  // Images
  static const String imageGetAll = '/image/get-images-for-home-page';
  static const String imageGetByUser = '/image/get-all-images-by-user';
  static const String imageGetAllPurchased = '/image/get-all-purchased-images';
  static const String imageGetLiked = '/image/get-all-like-images-by-user';
  static const String imageGetById = '/image/get-image-by-id';
  static const String imageLike = '/image/like';
  static const String imageComment = '/image/comment';
  static const String imageGetComments = '/image/get-comments-by-image';
  static const String imageUpload = '/image/upload';
  static const String imageUpdate = '/image/update';

  // Category
  static const String categoryGetAll = '/category/get-all-categories';

  // Transaction
  static const String transactionGetAll =
      '/wallet-transaction/search-transactions-by-user';
  static const String transactionCreate =
      '/wallet-transaction/create-transaction';

  // Wallet
  static const String walletGet = '/wallet/get-wallet-by-user';

  // Paypal
  static const String paypalCreate = '/paypal/create';
  static const String paypalExecute = '/paypal/execute-payment';

  // Subscription Plan
  static const String planGetAll = '/plan/get-all-plans';
}
