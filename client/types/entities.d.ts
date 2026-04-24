type TImageUrls = {
  w236: string
  w474: string
  w736: string
  w1080: string
  original: string
}

type TUserBasic = {
  id: string
  name: string
  avatar: string
  username: string
}

type TProfile = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  dob: string
  expiredDay: string
  warning: number
  public: boolean
  followedCategories: boolean
}

type TParticipant = TUserBasic

type TConversationResponseForChatBoxDto = {
  id: string
  name: string
  type: string
  avatar: string
  lastMessage: string
  lastMessageAt: string
  unreadMessageCount: number
  participants: TParticipant[]
  createdAt: string
  blockStatus: 'NONE' | 'BLOCKED' | 'IS_BLOCKED'
}

type TSocketConversationUpdate = {
  totalUnreadConversation: number
  conversationResponseForChatBoxDto: TConversationResponseForChatBoxDto
}

type TMessageConversation = {
  id: string
  content: string
  sender: TParticipant
  conversationId: string
  messageType: string
  createdDate: string
}

type TUserProfile = TUserBasic & {
  bio: string
  expiredDay: string
  follower: number
  following: number
  totalLike: number
  followStatus: 'UNFOLLOW' | 'ACCEPTED' | 'PENDING' | 'BLOCKED'
}

type TSearchUser = TUserBasic

type TFindConversation = {
  conversationId: string
  name: string
  type: string
}

type TCreateConversation = TFindConversation

type TFollowingUser = Omit<TUserBasic, 'id'> & {
  userId: string
  followStatus: 'UNFOLLOW' | 'ACCEPTED' | 'PENDING' | 'BLOCKED'
}

type TFollowerUser = TFollowingUser
type TPendingUser = TFollowingUser
type TBlockedUser = TFollowingUser

type TPostImage = {
  id: string
  creator: TUserBasic
  width: number
  height: number
  imageUrls: TImageUrls
  likeCount: number
  commentCount: number
  createdDate: string
  price: number
  liked: boolean
  deleted: boolean
}

type TPaginationPostImage = {
  imageResponseDto: TPostImage[]
  totalPage: number
}

type TCategory = {
  id: string
  name: string
  description: string
  featured: boolean
  slug: string
}

type TPostImageDetails = {
  id: string
  imageUrls: TImageUrls
  creator: TUserBasic
  categories: TCategory[]
  description: string
  likeCount: number
  commentCount: number
  createdDate: string
  liked: boolean
  purchased: boolean
  price: number
  visible: boolean
}

type TCommentImage = {
  id: string
  sender: TUserBasic
  content: string
  parentId: string
  imageId: string
  imageUrl: string
  like: number
  createdDate: string
}

type CommentNode = TCommentImage & {
  replies: CommentNode[]
}

type TCategory = {
  id: string
  name: string
  slug: string
  description: string
  createdDate: string
  updatedDate: string
  deleted: boolean
  featured: boolean
}

type TBaseNotifycation<T extends NotificationType> = {
  id: string
  type: T
  notificationCreatedDate: string
  read: boolean
}

type TSubscriptionNotification = TBaseNotifycation<NotificationType.SUBSCRIPTION> & {
  content: string
}

type TContactNotification = TBaseNotifycation<NotificationType.ACCEPTED> & {
  content: string
  sender: TUserBasic
}

type TNotificationComment = {
  id: string
  content: string
  sender: TUserBasic
  parentId: string
  imageId: string
  imageUrl: string
  like: number
  createdDate: string
}

type TCommentNotification = TBaseNotifycation<NotificationType.COMMENT> & {
  comment: TNotificationComment
}

type TLikeNotification = TBaseNotifycation<NotificationType.LIKE> & {
  sender: TUserBasic
  imageId: string
  image: string
}

type TReplyCommentNotification = TBaseNotifycation<NotificationType.REPLY_COMMENT> & {
  comment: TNotificationComment
}

type TSaleImageNotification = TBaseNotifycation<NotificationType.SALE_IMAGE> & {
  sender: TUserBasic
  imageId: string
  image: string
}

type TFollowerNotification = TBaseNotifycation<NotificationType.FOLLOW_REQUEST> & {
  content: string
  sender: TUserBasic
}

type TNotification =
  | TSubscriptionNotification
  | TContactNotification
  | TCommentNotification
  | TLikeNotification
  | TReplyCommentNotification
  | TSaleImageNotification
  | TFollowerNotification

type TNotificationDto = {
  totalPage: number
  notifications: TNotification[]
}

type TSocketNotification = {
  totalNotifications: number
  notification: TNotification
}

type TTransaction = {
  id: string
  amount: number
  feeAmount: number
  feePercent: number
  netReceivedAmount: number
  balanceAfter: number
  description: string
  type: TransactionType
  createdDate: string
}

type TTransactionDto = {
  totalPage: number
  walletTransactionResponseDtos: TTransaction[]
}

type TWallet = {
  balance: number
  totalSpent: number
  totalEarned: number
}

type TSubscriptionPlan = {
  id: string
  price: number
  currency: string
  durationDays: number
  description: string | null
  createdDate: string
  updatedDate: string
  deleted: boolean
}
