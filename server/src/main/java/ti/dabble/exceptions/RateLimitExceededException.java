package ti.dabble.exceptions;

public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException() {
        super("Too many requests, please try again later.");
    }

    public RateLimitExceededException(String message) {
        super(message);
    }
}