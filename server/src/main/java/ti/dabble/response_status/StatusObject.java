package ti.dabble.response_status;

import jakarta.annotation.Nullable;

public class StatusObject<T> {
    public boolean isSuccess ;
    @Nullable
    public String message ;
    @Nullable
    public String errorMessage ;
    @Nullable
    public T data ;
    public StatusObject() {
    }
    public StatusObject(
            boolean isSuccess,
            @Nullable String message,
            @Nullable String errorMessage,
            @Nullable T data
    ) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.errorMessage = errorMessage;
        this.data = data;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

    @Nullable
    public String getMessage() {
        return message;
    }

    public void setMessage(@Nullable String message) {
        this.message = message;
    }

    @Nullable
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(@Nullable String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Nullable
    public T getData() {
        return data;
    }

    public void setData(@Nullable T data) {
        this.data = data;
    }
}
