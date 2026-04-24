package ti.dabble.services.turnstitle;

public interface ITurnstileService {
    public boolean verifyToken(String token, String remoteIp);
}
