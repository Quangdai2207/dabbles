import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/core_providers.dart';
import '../data/datasources/remote/chat_remote_datasource.dart';
import '../data/repositories/chat_repository_impl.dart';
import '../domain/repositories/chat_repository.dart';
import '../domain/usecases/chat_usecases.dart';

// Datasource
final Provider<ChatRemoteDataSource> chatRemoteDatasourceProvider =
    Provider<ChatRemoteDataSource>((Ref ref) {
      return ChatRemoteDataSource(ref.watch(apiClientProvider));
    });

// Repository
final Provider<ChatRepository> chatRepositoryProvider =
    Provider<ChatRepository>((Ref ref) {
      return ChatRepositoryImpl(ref.watch(chatRemoteDatasourceProvider));
    });

// Use Cases
final Provider<GetConversationsUseCase> getConversationsUseCaseProvider =
    Provider<GetConversationsUseCase>((Ref ref) {
      return GetConversationsUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<GetMessagesUseCase> getMessagesUseCaseProvider =
    Provider<GetMessagesUseCase>((Ref ref) {
      return GetMessagesUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<FindConversationUseCase> findConversationUseCaseProvider =
    Provider<FindConversationUseCase>((Ref ref) {
      return FindConversationUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<CreateConversationUseCase> createConversationUseCaseProvider =
    Provider<CreateConversationUseCase>((Ref ref) {
      return CreateConversationUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<MarkAsReadUseCase> markChatAsReadUseCaseProvider =
    Provider<MarkAsReadUseCase>((Ref ref) {
      return MarkAsReadUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<DeleteConversationUseCase> deleteConversationUseCaseProvider =
    Provider<DeleteConversationUseCase>((Ref ref) {
      return DeleteConversationUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<GetTotalUnreadCountUseCase> getTotalUnreadCountUseCaseProvider =
    Provider<GetTotalUnreadCountUseCase>((Ref ref) {
      return GetTotalUnreadCountUseCase(ref.watch(chatRepositoryProvider));
    });

final Provider<ToggleBlockUseCase> toggleBlockUseCaseProvider =
    Provider<ToggleBlockUseCase>((Ref ref) {
      return ToggleBlockUseCase(ref.watch(chatRepositoryProvider));
    });
