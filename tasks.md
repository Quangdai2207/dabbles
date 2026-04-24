# Flutter Conversion Tasks

This document outlines the detailed tasks for migrating the React/Next.js UI @client to @mobile Flutter for the key pages in `app/(main)`.
All APIs are assumed to be ready (`lib/features/.../data` and `lib/features/.../domain`). The focus is on `lib/presentation`.

## 1. Main Feed (Home)

- [ ] **Setup Feed Presentation Structure**
  - Ensure `lib/presentation/home` exists.
- [ ] **Create Feed Screen** (`lib/presentation/home/screens/home_screen.dart`)
  - [ ] Implement `FeedScreen` scaffold.
  - [ ] Add `InfinitePostList` widget.
  - [ ] Implement "No posts yet" empty state.
- [ ] **Create Feed Controller** (`lib/presentation/home/controllers/home_controller.dart`)
  - [ ] Call `getAllImagesService` for initial load.
  - [ ] Implement pagination logic.

## 2. Upload Page

- [ ] **Setup Upload Presentation Structure**
  - Ensure `lib/presentation/upload` exists.
- [ ] **Create Upload Screen** (`lib/presentation/upload/screens/upload_screen.dart`)
  - [ ] Implement Form: Description, Price, Image Dropzone equivalent, Category Selector.
  - [ ] "Publish Now" button.
- [ ] **Create Upload Controller** (`lib/presentation/upload/controllers/upload_controller.dart`)
  - [ ] Manage form state & submission.
  - [ ] Handle success/error feedback.

## 3. Balance Page

- [ ] **Setup Balance Presentation Structure**
  - Ensure `lib/presentation/balance` exists.
- [ ] **Create Balance Screen** (`lib/presentation/balance/screens/balance_screen.dart`)
  - [ ] Display current balance.
  - [ ] Transaction history list.
- [ ] **Create Balance Controller** (`lib/presentation/balance/controllers/balance_controller.dart`)
  - [ ] Fetch balance & transactions.
- [ ] **Register Route**
  - [ ] Add `BalanceRoute` to `app_router.dart`. (Route: `/balance`)

## 4. Library (User Profile)

- [x] **Setup Profile Presentation Structure**
  - Ensure `lib/presentation/profile` exists.
- [/] **Create Profile Screen** (`lib/presentation/profile/screens/user_profile_screen.dart`)
  - [x] User Header (Avatar, Username).
  - [ ] Tab View (Posts, etc.).
  - [ ] User images grid.
- [ ] **Create Profile Controller** (`lib/presentation/profile/controllers/profile_controller.dart`)
  - [ ] Fetch user details & posts.
- [x] **Register Route**
  - [x] Add `UserProfileRoute` to `app_router.dart`. (Route: `/u/:username`)
- [ ] **Edit Image Sub-page**
  - [ ] Create `lib/presentation/profile/screens/edit_image_screen.dart`.

## 5. Post Details

- [ ] **Setup Post Presentation Structure**
  - Ensure `lib/presentation/post` exists.
- [ ] **Create Post Details Screen** (`lib/presentation/post/screens/post_details_screen.dart`)
  - [ ] Full image view.
  - [ ] Metadata & Actions.
- [ ] **Create Post Details Controller** (`lib/presentation/post/controllers/post_details_controller.dart`)
  - [ ] Fetch post details.
- [ ] **Register Route**
  - [ ] Add `PostDetailsRoute` to `app_router.dart`. (Route: `/post/:id`)

## 6. Search Page

- [ ] **Setup Search Presentation Structure**
  - Ensure `lib/presentation/search` exists.
- [ ] **Create Search Screen** (`lib/presentation/search/screens/search_screen.dart`)
  - [ ] Search Bar & Results Grid.
- [ ] **Create Search Controller** (`lib/presentation/search/controllers/search_controller.dart`)
  - [ ] Handle search logic.

## 7. Settings Page

- [x] **Setup Settings Presentation Structure**
  - Ensure `lib/presentation/settings` exists.
- [x] **Create Settings Screen** (`lib/presentation/settings/screens/settings_screen.dart`)
  - [x] Options list & Logout.
- [x] **Create Settings Controller** (`lib/presentation/settings/controllers/settings_controller.dart`)
  - [x] Handle actions.

## 8. Notifications Page

- [ ] **Setup Notification Presentation Structure**
  - Ensure `lib/presentation/notification` exists.
- [ ] **Create Notification Screen** (`lib/presentation/notification/screens/notification_screen.dart`)
  - [ ] Notification list.
