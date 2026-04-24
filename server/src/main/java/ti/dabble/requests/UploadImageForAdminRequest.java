package ti.dabble.requests;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadImageForAdminRequest {
    private String description;
    @NotEmpty(message = "Category is required")
    private List<String> categoryIds;
    @NotNull(message = "File is required")
    private MultipartFile file;
}
