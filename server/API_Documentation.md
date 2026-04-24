# Dabble Server API Documentation

This document provides a comprehensive overview of all API endpoints available in the Dabble server application.

## Base URL
`http://localhost:3366/api/`

## Authentication

Some endpoints require authentication using a valid JWT token in the Authorization header. The token should be passed as a Bearer token.

## API Endpoints

### Auth API (`/api/auth`)

#### POST `/api/auth/login`
- **Description**: User login to the application
- **Content-Type**: `application/json`
- **Request Body**: `LoginRequest`
- **Example Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Headers**:
  - `X-Captcha-Token`: Captcha token for validation
- **Response**:
  - Success: `StatusAuth` object with token and user info
  - Failure: Error message
- **Status Codes**:
  - `200 OK`: Login successful
  - `400 Bad Request`: Invalid captcha or request data
  - `401 Unauthorized`: Invalid credentials

#### GET `/api/auth/profile`
- **Description**: Get authenticated user's profile information
- **Authentication Required**: Yes
- **Response**: `StatusObject<ProfileUserDto>`
- **Status Codes**:
  - `200 OK`: Profile retrieved successfully
  - `401 Unauthorized`: User not authenticated

#### POST `/api/auth/register`
- **Description**: Register a new user account
- **Content-Type**: `application/json`
- **Request Body**: `RegisterRequest`
- **Example Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "password": "SecurePassword123!",
    "passwordConfirm": "SecurePassword123!",
    "dateOfBirth": "01/01/1990"
  }
  ```
- **Headers**:
  - `X-Register-Token`: Register token for validation
- **Response**: `StatusObject<ProfileUserDto>`
- **Status Codes**:
  - `201 Created`: Registration successful
  - `400 Bad Request`: Invalid request data or register token

#### POST `/api/auth/verify-account`
- **Description**: Verify user account with token
- **Content-Type**: `application/json`
- **Request Body**: `TokenRequest`
- **Example Request Body**:
  ```json
  {
    "token": "verification-token-string"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Account verified successfully
  - `400 Bad Request`: Invalid token

#### POST `/api/auth/reset-password`
- **Description**: Reset user password
- **Content-Type**: `application/json`
- **Request Body**: `ResetPasswordRequest`
- **Example Request Body**:
  ```json
  {
    "token": "reset-token-string",
    "password": "NewSecurePassword123!",
    "passwordConfirm": "NewSecurePassword123!"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Password reset successfully
  - `400 Bad Request`: Invalid request

#### POST `/api/auth/check-valid-token`
- **Description**: Check if token is valid
- **Content-Type**: `application/json`
- **Request Body**: `TokenRequest`
- **Example Request Body**:
  ```json
  {
    "token": "token-string-to-validate"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Token is valid
  - `400 Bad Request**: Token is invalid

#### POST `/api/auth/forgot-password`
- **Description**: Request password reset
- **Content-Type**: `application/json`
- **Request Body**: `ForgotPasswordRequest`
- **Example Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `201 Created`: Password reset email sent
  - `400 Bad Request`: Invalid request

#### POST `/api/auth/google-login`
- **Description**: Login with Google account
- **Content-Type**: `application/json`
- **Request Body**: `GoogleLoginRequest`
- **Example Request Body**:
  ```json
  {
    "idToken": "google-id-token-string"
  }
  ```
- **Response**: `StatusAuth`
- **Status Codes**:
  - `200 OK`: Login successful
  - `401 Unauthorized`: Invalid Google token

### User API (`/api/user`)

#### POST `/api/user/update`
- **Description**: Update user profile information
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `UpdateInfoUserRequest`
- **Example Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "0987654321",
    "dateOfBirth": "01/01/1990"
  }
  ```
- **Response**: `StatusObject<ProfileUserDto>`
- **Status Codes**:
  - `200 OK`: Update successful
  - `400 Bad Request**: Invalid request data

#### POST `/api/user/change-password`
- **Description**: Change user password
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `ChangePasswordRequest`
- **Example Request Body**:
  ```json
  {
    "currentPassword": "oldPassword123!",
    "password": "NewSecurePassword123!",
    "passwordConfirm": "NewSecurePassword123!"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Password changed successfully
  - `400 Bad Request**: Invalid request data

#### POST `/api/user/toggle-account-privacy`
- **Description**: Toggle user account privacy settings
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `UpdatePrivacyRequest`
- **Example Request Body**:
  ```json
  {
    "isPublic": true
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Privacy setting updated
  - `400 Bad Request**: Invalid request data

### Payment API (`/api/payment`)

#### POST `/api/payment/create`
- **Description**: Create PayPal payment
- **Authentication Required**: Yes
- **Parameters**:
  - `amount` (double): Payment amount
- **Response**: `StatusObject<String>` containing payment URL
- **Status Codes**:
  - `200 OK`: Payment created successfully
  - `400 Bad Request**: Invalid request data

#### GET `/api/payment/success`
- **Description**: Handle successful PayPal payment
- **Parameters**:
  - `paymentId` (string): PayPal payment ID
  - `PayerID` (string): PayPal Payer ID
- **Response**: `StatusObject<Map<String, Object>>`
- **Status Codes**:
  - `200 OK`: Payment processed successfully
  - `400 Bad Request**: Invalid payment data

#### GET `/api/payment/cancel`
- **Description**: Handle cancelled PayPal payment
- **Response**: `StatusObject<String>` with cancellation message
- **Status Codes**:
  - `200 OK`: Payment cancelled message

### Notification API (`/api/notification`)

Currently, this controller is empty with no implemented endpoints.

### Message API (`/api/chat`)

#### POST `/api/chat/send-message`
- **Description**: Send a message in a conversation
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `SendMessageRequest`
- **Example Request Body**:
  ```json
  {
    "conversationId": "conv-123456789",
    "content": "Hello, how are you?"
  }
  ```
- **Response**: `StatusObject<MessageResponseDto>`
- **Status Codes**:
  - `200 OK`: Message sent successfully
  - `400 Bad Request**: Invalid request data

#### GET `/api/chat/message-of-conversation`
- **Description**: Get messages from a specific conversation
- **Authentication Required**: Yes
- **Parameters**:
  - `conversationId` (string): ID of the conversation
- **Response**: `StatusObject<List<MessageResponseDto>>`
- **Status Codes**:
  - `200 OK`: Messages retrieved successfully
  - `400 Bad Request**: Invalid conversation ID

### Image API (`/api/image`)

#### POST `/api/image/upload`
- **Description**: Upload a single image
- **Authentication Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (file): The image file to upload
- **Response**: `StatusObject<String>` with image URL
- **Status Codes**:
  - `201 Created`: Image uploaded successfully
  - `400 Bad Request**: Invalid file

#### POST `/api/image/uploads`
- **Description**: Upload multiple images
- **Authentication Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `files` (array of files): Multiple image files to upload
- **Response**: `StatusObject<List<String>>` with image URLs
- **Status Codes**:
  - `201 Created`: Images uploaded successfully
  - `400 Bad Request**: Invalid files

### Conversation API (`/api/conversation`)

#### POST `/api/conversation/create-conversation`
- **Description**: Create a new conversation
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `CreateConversationRequest`
- **Example Request Body**:
  ```json
  {
    "userEmails": ["user1@example.com", "user2@example.com"],
    "type": "PRIVATE",
    "name": "Team Discussion"
  }
  ```
- **Response**: `StatusObject<ConversationResponseDto>`
- **Status Codes**:
  - `200 OK`: Conversation created successfully
  - `400 Bad Request**: Invalid request data

#### POST `/api/conversation/add-participant-to-conversation`
- **Description**: Add a participant to a conversation
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `AddParticipantToConversationRequest`
- **Example Request Body**:
  ```json
  {
    "conversationId": "conv-123456789",
    "userEmail": "newuser@example.com"
  }
  ```
- **Response**: `StatusObject<ConversationResponseDto>`
- **Status Codes**:
  - `200 OK`: Participant added successfully
  - `400 Bad Request**: Invalid request data

#### GET `/api/conversation/conversation-of-user`
- **Description**: Get all conversations of the authenticated user
- **Authentication Required**: Yes
- **Response**: `StatusObject<List<ConversationResponseForChatBoxDto>>`
- **Status Codes**:
  - `200 OK`: Conversations retrieved successfully
  - `400 Bad Request**: Invalid request

#### PUT `/api/conversation/mark-as-read/{conversationId}`
- **Description**: Mark messages in a conversation as read
- **Authentication Required**: Yes
- **Path Parameter**:
  - `conversationId` (string): ID of the conversation
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Messages marked as read
  - `400 Bad Request**: Invalid conversation ID

#### DELETE `/api/conversation/delete-message-history-of-conversation/{conversationId}`
- **Description**: Delete message history of a conversation
- **Authentication Required**: Yes
- **Path Parameter**:
  - `conversationId` (string): ID of the conversation
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Message history deleted
  - `400 Bad Request**: Invalid conversation ID

#### DELETE `/api/conversation/leave-conversation/{conversationId}`
- **Description**: Leave a conversation
- **Authentication Required**: Yes
- **Path Parameter**:
  - `conversationId` (string): ID of the conversation
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Left conversation successfully
  - `400 Bad Request**: Invalid conversation ID

#### POST `/api/conversation/remove-user-from-conversation`
- **Description**: Remove a user from a conversation
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `RemoveUserFromConversationRequest`
- **Example Request Body**:
  ```json
  {
    "targetUserEmail": "user@example.com",
    "conversationId": "conv-123456789"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: User removed successfully
  - `400 Bad Request**: Invalid request data

### Contact API (`/api/contact`)

#### POST `/api/contact/follow-or-accept-or-deny`
- **Description**: Follow, accept follow request, or deny follow request
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `CreateFollowOrAcceptOrDenyRequest`
- **Example Request Body**:
  ```json
  {
    "typeOfRequest": "FOLLOW",
    "contactUserEmail": "user@example.com"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Operation successful
  - `400 Bad Request**: Invalid request data

#### POST `/api/contact/unfollow-or-block-or-unblock`
- **Description**: Unfollow, block, or unblock a user
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `CreateUnfollowOrBlockOrUnblockUserRequest`
- **Example Request Body**:
  ```json
  {
    "typeOfRequest": "UNFOLLOW",
    "contactUserEmail": "user@example.com"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Operation successful
  - `400 Bad Request**: Invalid request data

#### POST `/api/contact/remove-follower`
- **Description**: Remove a follower
- **Authentication Required**: Yes
- **Content-Type**: `application/json`
- **Request Body**: `RemoveFollowerRequest`
- **Example Request Body**:
  ```json
  {
    "followerEmail": "follower@example.com"
  }
  ```
- **Response**: `Status`
- **Status Codes**:
  - `200 OK`: Follower removed successfully
  - `400 Bad Request**: Invalid request data

### Admin API (`/api/admin`)

#### POST `/api/admin/create`
- **Description**: Create a new user (admin only)
- **Authentication Required**: Admin access
- **Content-Type**: `application/json`
- **Request Body**: `CreateUserRequest`
- **Example Request Body**:
  ```json
  {
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "phone": "1234567890",
    "roleId": "ADMIN",
    "password": "SecurePassword123!",
    "passwordConfirm": "SecurePassword123!",
    "dateOfBirth": "01/01/1990"
  }
  ```
- **Response**: `StatusObject<User>`
- **Status Codes**:
  - `201 Created`: User created successfully
  - `400 Bad Request**: Invalid request data

## Common Response Types

### Status
- `isSuccess`: Boolean indicating success
- `message`: Success message
- `errorMessage`: Error message if applicable

### StatusObject<T>
- `isSuccess`: Boolean indicating success
- `message`: Success message
- `errorMessage`: Error message if applicable
- `data`: Generic data type T containing the response data

### StatusAuth
- `isSuccess`: Boolean indicating success
- `message`: Success message
- `errorMessage`: Error message if applicable
- `accountId`: User account ID
- `expires`: Token expiration time
- `token`: JWT token

## Error Handling
- `400 Bad Request`: Request validation failed or invalid parameters
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error occurred