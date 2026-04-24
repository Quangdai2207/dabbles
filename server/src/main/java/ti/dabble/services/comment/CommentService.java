package ti.dabble.services.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import ti.dabble.dtos.CommentResponseDto;
import ti.dabble.entities.Comment;
import ti.dabble.entities.Image;
import ti.dabble.helpers.FileHelper;
import ti.dabble.mapper.FileMapper;
import ti.dabble.repositories.CommentRepository;
import ti.dabble.repositories.ImageRepository;
import ti.dabble.response_status.StatusObject;

@Service
public class CommentService implements ICommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private Cloudinary cloudinary;


    @Override
    public StatusObject<List<CommentResponseDto>> getCommentsByImageId(String imageId) {
        StatusObject<List<CommentResponseDto>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Image image = imageRepository.findImageById(UUID.fromString(imageId));
            if (image == null) {
                statusObject.setErrorMessage("Image not found");
                return statusObject;
            }
            List<Comment> comments = commentRepository.findCommentsByImageId(UUID.fromString(imageId));
            if(comments.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No comments found");
                return statusObject;
            }
            List<CommentResponseDto> commentResponseDtos = comments.stream()
                    .map((c) -> {
                        c.getUser().setAvatar(FileHelper.getAvatarUrl(cloudinary, c.getUser().getAvatar()));
                        return FileMapper.getCommentResponseDto(c);
                    }).sorted(
                            Comparator.comparing(CommentResponseDto::getCreatedDate).reversed())
                    .toList();
            statusObject.setMessage("Get all comments successfully");
            statusObject.setSuccess(true);
            statusObject.setData(commentResponseDtos);
            return statusObject;
        } catch (Exception e) {
            e.printStackTrace();
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }


}
