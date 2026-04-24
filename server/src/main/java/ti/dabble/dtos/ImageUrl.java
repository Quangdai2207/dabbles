package ti.dabble.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageUrl {
    private String w236;
    private String w474;
    private String w736;
    private String w1080;
    private String original;
}
