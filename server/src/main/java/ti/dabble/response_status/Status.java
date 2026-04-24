package ti.dabble.response_status;

public class Status {
    public boolean isSuccess;
    public String message;
    public String errorMessage;

    public Status() {
    }
    
    public Status(boolean isSuccess, String message, String errorMessage) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.errorMessage = errorMessage;
    }
    
    public boolean isSuccess() {
        return isSuccess;
    }
    
    public void setIsSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
