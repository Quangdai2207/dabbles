# Dabble Mobile - Agent Context

## Tech Stack

- **Framework**: Flutter (Dart SDK ^3.10.4)
- **State Management**: Riverpod
- **HTTP Client**: Dio
- **Local Storage**: flutter_secure_storage
- **Architecture**: Clean Architecture (Feature-First)

## Commands

```bash
# Build
flutter build apk
flutter build ios

# Testing
flutter test                              # Run all tests
flutter test test/widget_test.dart        # Run specific test file
flutter test --name "test_name"           # Run tests matching pattern
flutter test --plain-name "substring"      # Run tests with substring in name

# Linting & Formatting
flutter analyze                           # Check for issues
dart format .                             # Format all files
dart format --set-exit-if-changed .       # Format and exit with code if changed

# Code Generation
dart run build_runner build               # Generate code (json_serializable)
dart run build_runner build --delete-conflicting-outputs

# Cleanup
flutter clean && flutter pub get          # Clean and reinstall dependencies
```

## Project Structure

- `lib/main.dart` - Entry point
- `lib/app/` - App config
- `lib/core/` - Network, services, themes, providers, routing, guards, injection
  - `core/injection/export_injection.dart` - Barrel export all feature providers
  - `core/routing/app_router.dart` - Main router configuration
- `lib/features/` - Business logic (data, domain, injection per feature)
- `lib/presentation/` - UI layer (screens, controllers, widgets, routing)
  - Layout: `screens/` for full pages, `widgets/` for feature-specific components.
- `lib/shared/` - Constants, utils, reusable widgets, shared providers
  - Layout: `widgets/` for reusable components used across multiple features.

## Architecture Flow

```
presentation/ → core/injection/export_injection.dart → features/<feature>/injection/ → domain/ ← data/
```

- **Presentation có thể gọi nhiều features** thông qua `core/injection/export_injection.dart`
- **Features chỉ chứa**: `data/`, `domain/`, `injection/`

## Code Style Guidelines

### Naming Conventions

- **Files**: snake_case (e.g., `user_model.dart`, `login_controller.dart`)
- **Classes**: PascalCase (e.g., `AppTextField`, `LoginState`)
- **Variables/Parameters**: camelCase (e.g., `userName`, `isLoading`)
- **Private members**: Prefix with underscore (e.g., `_focusNode`, `_repository`)
- **Constants**: lowerCamelCase or UPPER_SNAKE_CASE for static constants
- **Providers**: camelCase with Provider suffix (e.g., `loginControllerProvider`)

### Type Annotations

- **Always specify types** (strict-inference enabled in analysis_options.yaml)
- Use explicit type declarations for all variables, parameters, and return types
- Avoid `dynamic` - use `Object?` or specific types
- Mark nullable types explicitly with `?`

### Imports

- **Order**: 1) Dart SDK imports, 2) Package imports (alphabetical), 3) Relative imports
- Separate groups with blank line
- Group relative imports by depth within the feature
- Export barrel files from `core/injection/export_injection.dart` for feature access

### Constants & Final

- Use `final` for all variables that don't need reassignment (prefer_final_locals, prefer_final_fields)
- Use `const` constructors where possible
- Define theme colors in `AppColors` constants file, but access via `Theme.of(context)` in widgets

### Models

- Use `@JsonSerializable()` annotation
- Extend entity classes with `extends EntityName`
- Include `part 'model_name.g.dart';` directive
- Run `dart run build_runner build` after creating/modifying models

### Error Handling

- Catch `DioException` for API calls
- Return error response objects (`ApiResponse.error()` or `ApiAuthResponse.error()`)
- Extract error messages from response data with fallback
- Use try-catch in controllers and update state with error status

### State Management (Riverpod)

- Use `StateNotifier` for controllers with state
- Implement `copyWith` method in state classes (extends `Equatable`)
- Define providers with `StateNotifierProvider` syntax
- Use `ref.watch()` for reading state, `ref.read()` for calling methods
- Use `ref.listen()` for side effects (toast notifications, navigation)

### Widget Styling

- **Mandatory**: Use `Theme.of(context)` for colors and text styling
- **NEVER** reference `AppColors` directly in widgets
- Access `theme.colorScheme` and `theme.textTheme`
- Apply consistent 16px border radius for inputs/buttons
- Add smooth animations for focus states and interactions

### UI/UX Guidelines

- **Premium Design**: Glassmorphism effects, soft shadows, rounded corners (16px)
- **Animations**: Use `AnimationController` for focus states and transitions
- **Font**: Comfortaa (Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700)
- **Logo**: Always use `Assets.logo` from `shared/constants/assets.dart`
- **Loading States**: Show `CircularProgressIndicator` in buttons during async ops

### File Organization

- Features follow strict layering: `data/` → `domain/` → `injection/`
- Presentation: `controllers/`, `providers/`, `screens/`, `states/`, `widgets/`
- Route handlers in `<feature>_routes.dart`
- Register routes in `core/routing/app_router.dart`

## Rules for Agent

- Work directly, analyze and edit code without verbose explanations
- Follow Clean Architecture pattern strictly
- **After implementation**: Run `flutter analyze`, fix all warnings/errors, then `dart format .`
- Create tests for new functionality when appropriate
- Use existing patterns and conventions from EXAMPLE_NEW_FEATURE.md
- Verify with `flutter test` after implementing tests

## Important References

- [pubspec.yaml](pubspec.yaml) - Project configuration
- [analysis_options.yaml](analysis_options.yaml) - Analysis options and lint rules
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Folder structure details
- [EXAMPLE_NEW_FEATURE.md](EXAMPLE_NEW_FEATURE.md) - New feature example
