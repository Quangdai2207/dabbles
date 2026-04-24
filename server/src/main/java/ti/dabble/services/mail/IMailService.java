package ti.dabble.services.mail;

import java.util.Map;

import ti.dabble.enums.EmailType;

public interface IMailService {
     boolean sendMail(
            String to,
            String subject,
            String templateName,
            Map<String, Object> data
    );

     boolean sendMailAndCreateTokens(String email, EmailType typeOfMail);
}