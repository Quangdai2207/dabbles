package ti.dabble.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BaseNotificationAndPaginationDto {
        private int totalPage;
        private List<BaseNotificationResponseDto> notifications;

}
