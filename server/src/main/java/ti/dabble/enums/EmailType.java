package ti.dabble.enums;

public enum EmailType {
    ACCOUNT_VERIFICATION("verify-account", "Verify Your Account", "verify_account"),
    PASSWORD_RESET("reset-password", "Reset Your Password", "reset_password");

    private final String path;
    private final String subject;
    private final String templateName;

    EmailType(String path, String subject, String templateName) {
        this.path = path;
        this.subject = subject;
        this.templateName = templateName;
    }

    // Getters
    public String getPath() { return path; }
    public String getSubject() { return subject; }
    public String getTemplateName() { return templateName; }
}
