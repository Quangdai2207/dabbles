package ti.dabble.services.contact;

import java.util.List;

import jakarta.annotation.Nullable;
import ti.dabble.dtos.ContactResponseDto;
import ti.dabble.requests.CreateFollowOrAcceptOrDenyRequest;
import ti.dabble.requests.CreateUnfollowOrBlockOrUnblockUserRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IContactService {
    Status followOrAcceptOrDenyUser(CreateFollowOrAcceptOrDenyRequest createFollowOrAcceptOrDenyRequest,
            String senderEmail);

    Status unfollowOrBlockOrUnblockUser(
            CreateUnfollowOrBlockOrUnblockUserRequest createUnfollowOrBlockOrUnblockUserRequest, String senderEmail);

    Status removeFollower(String username, String removerEmail);

    StatusObject<List<ContactResponseDto>> getAllFollowersOfUser(String targetUserId, @Nullable String authEmail);

    StatusObject<List<ContactResponseDto>> getAllFollowingsOfUser(String targetUserId, @Nullable String authEmail);

    StatusObject<List<ContactResponseDto>> getAllPendingOfUser(String userEmail);
        StatusObject<List<ContactResponseDto>> getAllBlockedOfUser(String userEmail);
}
