package ti.dabble.services.jwt;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.Claims;
import ti.dabble.entities.User;

public interface IJwtService {
    public String generateToken(User user);
    public String extractUsername(String token);
    public Date extractExpiration(String token);
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
    public Boolean validateToken(String token, UserDetails userDetails);
}
