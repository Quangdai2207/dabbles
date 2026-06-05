package ti.dabble.services.proxy;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ti.dabble.models.principal.UserPrincipal;

import java.security.Key;

@Component
public class AuthProxyService implements IAuthProxyService {
//    private static final String SECRET = "5367566859703373367639792F423F452848284D6251655468576D5A71347437";

    @Value("${JWT_SecretKey}")
    private String SECRET;
    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(SECRET)
        );
    }

    @Override
    public UserPrincipal verify(String token) {
        System.out.println("Key: " + this.key);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return new UserPrincipal(
                claims.getSubject(),
                claims.get("role", String.class)
        );
    }
}

