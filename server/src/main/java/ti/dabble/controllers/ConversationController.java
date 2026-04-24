package ti.dabble.controllers;

import ti.dabble.dtos.ConversationResponseDto;
import ti.dabble.dtos.ConversationResponseForChatBoxDto;
import ti.dabble.requests.AddParticipantToConversationRequest;
import ti.dabble.requests.CreateConversationRequest;
import ti.dabble.requests.RemoveUserFromConversationRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

import jakarta.validation.Valid;
import ti.dabble.services.conversation.IConversationService;

@RestController
@RequestMapping("/api/conversation")
class ConversationController {
    @Autowired
    private IConversationService conversationService;

    @PostMapping(value = "/create-conversation", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ConversationResponseDto>> createConversation(@Valid @RequestBody
                                                                         CreateConversationRequest createConversationRequest, Authentication authentication) {
        StatusObject<ConversationResponseDto> statusObject = conversationService.createConversation(authentication.getName(), createConversationRequest);
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @PostMapping(value = "/add-participant-to-conversation", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ConversationResponseDto>> addParticipantToConversation(@Valid @RequestBody
                                                                                   AddParticipantToConversationRequest addParticipantToConversationRequest, Authentication authentication) {
        StatusObject<ConversationResponseDto> statusObject = conversationService.addParticipantToConversation(authentication.getName(), addParticipantToConversationRequest);
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/conversation-of-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ConversationResponseForChatBoxDto>>> getConversationOfUser(Authentication authentication) {
        StatusObject<List<ConversationResponseForChatBoxDto>> statusObject = conversationService.findAllConversationOfUser(authentication.getName());
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/total-of-unread-conversation", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Integer>> getTotalUnreadConversation(Authentication authentication) {
        StatusObject<Integer> statusObject = conversationService.getTotalOfUnreadConversation(authentication.getName());
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @PutMapping(value = "/mark-as-read/{conversationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> markAsRead(@PathVariable("conversationId") String conversationId, Authentication authentication) {
        Status statusObject = conversationService.markAsRead(authentication.getName(), conversationId);
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @DeleteMapping(value = "/delete-message-history-of-conversation/{conversationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteMessageHistoryOfConversation(@PathVariable("conversationId") String conversationId
                                                                               , Authentication authentication) {
        Status statusObject = conversationService.deleteMessageHistoryOfConversation(conversationId, authentication.getName());
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @DeleteMapping(value = "/leave-conversation/{conversationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> leaveConversation(@PathVariable("conversationId") String conversationId, Authentication authentication) {
        Status statusObject = conversationService.leaveConversation(authentication.getName(), conversationId);
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @PostMapping(value = "/remove-user-from-conversation", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> leaveConversation(@Valid @RequestBody RemoveUserFromConversationRequest removeUserFromConversationRequest, Authentication authentication) {
        Status status = conversationService.removeUserFromConversation(authentication.getName(), removeUserFromConversationRequest);
        if(status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }

    @GetMapping(value = "/find-existing-private-conversation/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ConversationResponseDto>> findExistingPrivateConversation(@PathVariable("username") String username, Authentication authentication) {
        StatusObject<ConversationResponseDto> statusObject = conversationService.findExistingPrivateConversation(authentication.getName(), username);
        if(statusObject.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }
}
