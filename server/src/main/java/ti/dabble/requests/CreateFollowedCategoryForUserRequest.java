package ti.dabble.requests;

import java.util.List;

import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFollowedCategoryForUserRequest {
    @NotEmpty(message = "Must choose at least 1 category")
    private List<String> categoryIds;
}
