# Dabble Mobile - Project Structure

```
mobile/
├── lib/
│   ├── main.dart
│   │
│   ├── app/                      # App configuration
│   │   └── app.dart
│   │
│   ├── core/                     # Core utilities
│   │   ├── config/
│   │   ├── guards/
│   │   ├── injection/
│   │   │   └── export_injection.dart
│   │   ├── network/
│   │   │   └── api_client.dart
│   │   ├── providers/
│   │   │   └── core_providers.dart
│   │   ├── routing/
│   │   │   ├── app_router.dart
│   │   │   ├── route_handler.dart
│   │   │   └── routes.dart
│   │   ├── services/
│   │   │   └── storage_service.dart
│   │   └── themes/
│   │
│   ├── features/                 # Business logic only
│   │   └── <feature_name>/
│   │       ├── data/
│   │       │   ├── datasources/
│   │       │   ├── models/
│   │       │   └── repositories/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   ├── repositories/
│   │       │   └── usecases/
│   │       └── injection/
│   │           └── <feature>_injection.dart
│   │
│   ├── presentation/             # UI layer
│   │   └── <screen_group>/
│   │       ├── controllers/
│   │       ├── providers/
│   │       ├── screens/
│   │       ├── states/
│   │       ├── widgets/
│   │       └── <group>_routes.dart
│   │
│   └── shared/
│       ├── constants/
│       ├── providers/
│       ├── utils/
│       └── widgets/
│
├── assets/
├── test/
├── android/
└── ios/
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  presentation/                                                  │
│  - Có thể gọi NHIỀU features                                   │
│  - Import từ: core/injection/export_injection.dart             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  core/injection/export_injection.dart (barrel export)          │
│  - Export core + tất cả feature injections                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  features/<feature>/injection/                                  │
│  - Wire domain với data cho từng feature                       │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│  features/.../domain/    │◄────│  features/.../data/     │
└─────────────────────────┘     └─────────────────────────┘
```

## Hướng dẫn tạo Feature mới

### 1. Business Logic (trong features/)

```
lib/features/<feature_name>/
├── data/
│   ├── datasources/remote/<feature>_remote_datasource.dart
│   ├── models/<feature>_model.dart
│   └── repositories/<feature>_repository_impl.dart
├── domain/
│   ├── entities/<feature>_entity.dart
│   ├── repositories/<feature>_repository.dart
│   └── usecases/<feature>_usecase.dart
└── injection/
    └── <feature>_injection.dart
```

### 2. Presentation (trong presentation/)

```
lib/presentation/<screen_group>/
├── controllers/<name>_controller.dart
├── providers/<name>_provider.dart
├── screens/<name>_screen.dart
├── states/<name>_state.dart
├── widgets/
└── <group>_routes.dart
```

### 3. Các bước

| Bước | Layer        | File                                                    |
| ---- | ------------ | ------------------------------------------------------- |
| 1    | Domain       | entities, repositories (interface), usecases            |
| 2    | Data         | models, datasources, repositories (impl)                |
| 3    | Injection    | `features/<feature>/injection/<feature>_injection.dart` |
| 4    | Export       | Thêm vào `core/injection/export_injection.dart`         |
| 5    | Presentation | controllers, providers, screens, states, routes         |
| 6    | Router       | Thêm handler vào `core/routing/app_router.dart`         |
