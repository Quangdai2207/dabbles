package ti.dabble.services.comment;

import java.util.List;

import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.response_status.StatusObject;

public interface ICommentService {

    StatusObject<List<CommentResponseDto>> getCommentsByImageId(String imageId);
}
