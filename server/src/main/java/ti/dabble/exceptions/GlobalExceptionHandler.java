package ti.dabble.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt lỗi validation các field (@NotBlank, @MinimumAge, ...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {

        // Lấy tất cả message và nối bằng dấu ", "
        String errorMessage = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(" \n "));

        return new ResponseEntity<>(
                Map.of(
                        "isSuccess", false,
                        "message", "Validation Failed",
                        "errorMessage", errorMessage
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    // Bắt lỗi parse JSON (ví dụ sai format date)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleInvalidFormat(HttpMessageNotReadableException ex) {

        String errorMessage;

        Throwable cause = ex.getMostSpecificCause();
        if (cause instanceof InvalidFormatException invalidFormat) {
            String field = invalidFormat.getPath().get(0).getFieldName();
            String targetType = invalidFormat.getTargetType().getSimpleName();
            String value = invalidFormat.getValue() == null ? "null" : invalidFormat.getValue().toString();

            errorMessage = "Invalid value '" + value + "' for type " + targetType + " at field '" + field + "'";
        } else {
            errorMessage = cause.getMessage();
        }

        return new ResponseEntity<>(
                Map.of(
                        "isSuccess", false,
                        "message", "Validation Failed",
                        "errorMessage", errorMessage
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    // Bắt lỗi khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleOtherExceptions(Exception ex) {

        return new ResponseEntity<>(
                Map.of(
                        "isSuccess", false,
                        "message", "An unexpected error occurred",
                        "errorMessage", ex.getMessage()
                ),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    // Bắt lỗi Rate Limit
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<Object> handleRateLimitException(RateLimitExceededException ex) {

        return new ResponseEntity<>(
                Map.of(
                        "isSuccess", false,
                        "message", "Rate limit exceeded",
                        "errorMessage", ex.getMessage()
                ),
                HttpStatus.TOO_MANY_REQUESTS
        );
    }

}
