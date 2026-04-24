package ti.dabble.response_status;

import jakarta.annotation.Nullable;

public class StatusAuth {

    public boolean isSuccess;
    @Nullable
    public String message;
    @Nullable
    public String errorMessage;
    @Nullable
    public String token;
    @Nullable
    public String accountId;
    public int expires;

    public StatusAuth() {
    }

    public StatusAuth(boolean isSuccess, @Nullable String message, @Nullable String errorMessage, @Nullable String token, @Nullable String accountId, int expires) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.errorMessage = errorMessage;
        this.token = token;
        this.accountId = accountId;
        this.expires = expires;
    }

    // Getter and setter methods to maintain consistency with the public field
    public boolean getIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
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
    public String getToken() {
        return token;
    }

    public void setToken(@Nullable String token) {
        this.token = token;
    }

    @Nullable
    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(@Nullable String accountId) {
        this.accountId = accountId;
    }

    public int getExpires() {
        return expires;
    }

    public void setExpires(int expires) {
        this.expires = expires;
    }
}
