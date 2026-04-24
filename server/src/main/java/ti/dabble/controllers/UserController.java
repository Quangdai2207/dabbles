package ti.dabble.controllers;

import jakarta.annotation.Nullable;
import ti.dabble.annotations.RateLimit;
import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.dtos.ProfileUserWithImageDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.entities.User;
import ti.dabble.requests.ChangePasswordRequest;
import ti.dabble.requests.CreateFollowedCategoryForUserRequest;
import ti.dabble.requests.UpdateInfoUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.user.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
class UserController {
    @Autowired
    private IUserService userService;


    @GetMapping(value = "/get-all-users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<User>>> getAllUsers() {
        StatusObject<List<User>> status = userService.getAllUsers();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/get-user-by-id/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<User>> getUserById(@PathVariable("userId") String userId) {
        StatusObject<User> status = userService.getUserById(userId);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ProfileUserDto>> updateUser(
            @Valid @ModelAttribute UpdateInfoUserRequest updateInfoUserRequest) {
        StatusObject<ProfileUserDto> status = userService.update(updateInfoUserRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PutMapping(value = "/change-password", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        Status status = userService.changePassword(changePasswordRequest);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @RateLimit(limit = 20, window = 60)
    @PutMapping(value = "/toggle-account-privacy", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> toggleAccountPrivacy() {
        Status status = userService.toggleAccountPrivacy();
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @GetMapping(value = "/profile-user-with-image/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<ProfileUserWithImageDto>> profileUserWithImage(
            @PathVariable("username") String username,
            @Nullable Authentication authentication) {
        StatusObject<ProfileUserWithImageDto> status = userService.profileUserWithImage(username,
                authentication == null ? null : authentication.getName());
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

    @PostMapping(value = "add-categories-for-user", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> addFollowedCategory(
            @Valid @RequestBody CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest,
            Authentication authentication) {
        Status statusObject = userService.addFollowedCategory(authentication.getName(),
                createFollowedCategoryForUserRequest);
        if (statusObject.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @PutMapping(value = "update-categories-for-user", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> updateFollowedCategory(
            @Valid @RequestBody CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest,
            Authentication authentication) {
        Status statusObject = userService.updateFollowedCategory(authentication.getName(),
                createFollowedCategoryForUserRequest);
        if (statusObject.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(statusObject);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(statusObject);
    }

    @RateLimit(limit = 60, window = 60)
    @GetMapping(value = "/search-by-username/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<UserSummaryDto>>> searchByUsername(
            @PathVariable("username") String username, @Nullable Authentication authentication) {
        String authEmail = authentication == null ? null : authentication.getName();
        StatusObject<List<UserSummaryDto>> status = userService.searchByUsername(username, authEmail);
        if (status.isSuccess) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(status);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(status);
    }

}
