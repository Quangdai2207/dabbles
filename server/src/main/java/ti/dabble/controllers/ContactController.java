package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import ti.dabble.annotations.RateLimit;
import ti.dabble.dtos.ContactResponseDto;
import ti.dabble.requests.CreateFollowOrAcceptOrDenyRequest;
import ti.dabble.requests.CreateUnfollowOrBlockOrUnblockUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.contact.IContactService;

@RestController
@RequestMapping("/api/contact")
class ContactController {
    @Autowired
    private IContactService contactService;

    @RateLimit(limit = 10, window = 60)
    @PostMapping("/follow-or-accept-or-deny")
    public ResponseEntity<Status> followOrAcceptOrDenyUser(
            @Valid @RequestBody CreateFollowOrAcceptOrDenyRequest createFollowOrAcceptOrDenyRequest,
            Authentication authentication) {
        Status status = contactService.followOrAcceptOrDenyUser(createFollowOrAcceptOrDenyRequest,
                authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }
    @RateLimit(limit = 10, window = 60)
    @PostMapping("/unfollow-or-block-or-unblock")
    public ResponseEntity<Status> unfollowOrBlockOrUnblockUser(
            @Valid @RequestBody CreateUnfollowOrBlockOrUnblockUserRequest createUnfollowOrBlockOrUnblockUserRequest,
            Authentication authentication) {
        Status status = contactService.unfollowOrBlockOrUnblockUser(createUnfollowOrBlockOrUnblockUserRequest,
                authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }

    @DeleteMapping("/remove-follower/{username}")
    public ResponseEntity<Status> removeFollower(@PathVariable("username") String username, Authentication authentication) {
        Status status = contactService.removeFollower(username, authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(status);
    }

    @RateLimit(limit = 10, window = 10)
    @GetMapping(value = "/get-all-followers-of-user/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ContactResponseDto>>> getAllFollowerOfUser(@PathVariable("username") String username,
            @Nullable Authentication authentication) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<List<ContactResponseDto>> statusObject = contactService.getAllFollowersOfUser(username, authEmail);
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }
    @RateLimit(limit = 10, window = 10)
    @GetMapping(value = "/get-all-followings-of-user/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ContactResponseDto>>> getAllFollowingOfUser(@PathVariable("username") String username,
            @Nullable Authentication authentication) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<List<ContactResponseDto>> statusObject = contactService.getAllFollowingsOfUser(username,
                authEmail);
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @RateLimit(limit = 10, window = 10)
    @GetMapping(value = "/get-all-blocked-of-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ContactResponseDto>>> getAllBlockedOfUser(Authentication authentication) {
        StatusObject<List<ContactResponseDto>> statusObject = contactService.getAllBlockedOfUser(authentication.getName());
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }
    @RateLimit(limit = 10, window = 10)
    @GetMapping(value = "/get-all-pending-of-user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<ContactResponseDto>>> getAllPendingOfUser(Authentication authentication) {
        StatusObject<List<ContactResponseDto>> statusObject = contactService
                .getAllPendingOfUser(authentication.getName());
        if (statusObject.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK).body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(statusObject);
    }

}
