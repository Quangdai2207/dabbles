import addBaseUrl from '@/lib/add-base-url'

const BASE_API_URL = process.env.NEXT_PUBLIC_BE_SERVER_API!

const apiUrls = {
  auth: {
    login: '/auth/login',
    googleLogin: '/auth/google-login',
    register: '/auth/register',
    verifyAccount: '/auth/verify-account',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    checkValidToken: '/auth/check-valid-token',
    profile: '/auth/profile',
    logout: '/auth/logout'
  },
  conversation: {
    getConversations: '/conversation/conversation-of-user',
    findConversation: '/conversation/find-existing-private-conversation',
    createConversation: '/conversation/create-conversation',
    totalUnreadConversations: '/conversation/total-of-unread-conversation',
    deleteMessageConversation: '/conversation/delete-message-history-of-conversation'
  },
  chat: {
    sendMessage: '/chat/send-message',
    getMessages: '/chat/message-of-conversation'
  },
  user: {
    getUserProfile: '/user/profile-user-with-image',
    updateProfile: '/user/update',
    changePassword: '/user/change-password',
    toggleAccountPrivacy: '/user/toggle-account-privacy',
    searchUsers: '/user/search-by-username',
    addCategoriesForUser: '/user/add-categories-for-user',
    updateCategoriesForUser: '/user/update-categories-for-user'
  },
  contact: {
    following: '/contact/get-all-followings-of-user',
    followers: '/contact/get-all-followers-of-user',
    pending: '/contact/get-all-pending-of-user',
    follow_or_accept_or_deny: '/contact/follow-or-accept-or-deny',
    unfollow_or_block_or_unblock: '/contact/unfollow-or-block-or-unblock',
    removeFollower: '/contact/remove-follower',
    getAllBlocked: '/contact/get-all-blocked-of-user'
  },
  notification: {
    totalUnreadNotifications: '/notification/total-notification',
    getNotifications: '/notification/get-all-notification',
    markReadAll: '/notification/mark-as-read-all-notifications',
    markRead: '/notification/mark-as-read-notification',
    removeNotification: '/notification/delete-notification'
  },
  images: {
    getAllImages: '/image/get-images-for-home-page',
    getImagesByUser: '/image/get-all-images-by-user',
    getAllPurchasedImages: '/image/get-all-purchased-images',
    getLikedImages: '/image/get-all-like-images-by-user',
    getImageById: '/image/get-image-by-id',
    likeImageById: '/image/like',
    commentImageById: '/image/comment',
    getCommentsByImageId: '/image/get-comments-by-image',
    upload: '/image/upload',
    update: '/image/update',
    delete: '/image/delete-image'
  },
  category: {
    getAllCategories: '/category/get-all-categories',
    getFollowedCategoriesByUser: '/category/get-followed-categories-by-user'
  },
  transaction: {
    getAllTransactions: '/wallet-transaction/search-transactions-by-user',
    createTransaction: '/wallet-transaction/create-transaction'
  },
  wallet: {
    getWallet: '/wallet/get-wallet-by-user'
  },
  paypal: {
    create: '/paypal/create',
    execute: '/paypal/execute-payment'
  },
  subscriptionPlan: {
    getAllPlans: '/plan/get-all-plans'
  }
}

const ApiBeUrls = addBaseUrl(apiUrls, BASE_API_URL)
export default ApiBeUrls
