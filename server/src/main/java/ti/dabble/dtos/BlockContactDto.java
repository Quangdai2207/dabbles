package ti.dabble.dtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ti.dabble.enums.BlockStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockContactDto {
    private UUID userId;
    private BlockStatus blockStatus;
}
