package ti.dabble.services.user;

import java.util.List;

import jakarta.annotation.Nullable;
import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.dtos.ProfileUserWithImageDto;
import ti.dabble.dtos.UserFollowedCategoryDto;
import ti.dabble.dtos.UserSummaryDto;
import ti.dabble.entities.User;
import ti.dabble.requests.ChangePasswordRequest;
import ti.dabble.requests.CreateFollowedCategoryForUserRequest;
import ti.dabble.requests.UpdateInfoUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IUserService {
    StatusObject<Integer> countUsers();

    StatusObject<List<User>> getAllUsers();

    StatusObject<User> getUserById(String userId);

    StatusObject<ProfileUserDto> getUserByEmail(String email);

    StatusObject<ProfileUserDto> update(
            UpdateInfoUserRequest updateInfoUserRequest);

    User getUserByAuthentication();

    Status changePassword(ChangePasswordRequest changePasswordRequest);

    Status toggleAccountPrivacy();

    StatusObject<ProfileUserWithImageDto> profileUserWithImage(String userId, @Nullable String authEmail);

    Status addFollowedCategory(String authEmail, CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest);

    Status updateFollowedCategory(String authEmail, CreateFollowedCategoryForUserRequest createFollowedCategoryForUserRequest);

    StatusObject<List<UserSummaryDto>> searchByUsername(String username, @Nullable String authEmail);

}
