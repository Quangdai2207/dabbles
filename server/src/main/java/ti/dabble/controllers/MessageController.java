package ti.dabble.controllers;

import ti.dabble.dtos.MessageResponseDto;
import ti.dabble.requests.SendMessageRequest;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.message.IMessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chat")
class MessageController {
    @Autowired
    private IMessageService messageService;
    @PostMapping(value = "/send-message", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<MessageResponseDto>> sendMessage(@Valid @RequestBody
                                             SendMessageRequest sendMessageRequest, Authentication authentication
                                             ) {
        StatusObject<MessageResponseDto> statusObject = messageService.sendMessage(sendMessageRequest, authentication.getName());
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/message-of-conversation/{conversationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<MessageResponseDto>>> messageOfConversation(@PathVariable("conversationId") String conversationId, @RequestParam(value = "cursor", required = false) String cursor, Authentication authentication) {
        StatusObject<List<MessageResponseDto>> statusObject = messageService.messageOfConversation(authentication.getName(), conversationId, cursor);
        if(statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }
}
