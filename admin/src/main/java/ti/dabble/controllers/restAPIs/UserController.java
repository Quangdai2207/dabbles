package ti.dabble.controllers.restAPIs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @GetMapping(
            value = "/state/{slug}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Object getStateUser(@PathVariable String slug) {
        String redisKey = "ws:online:" + slug;
        String redisRaw = stringRedisTemplate.opsForValue().get(redisKey);
        Map<String, Object> res = new HashMap<>();

        res.put("userId", slug);
        res.put("event", redisRaw != null ? "CONNECTED" : "DISCONNECT");
        res.put("isLogin", redisRaw != null);

        return res;
    }
}
