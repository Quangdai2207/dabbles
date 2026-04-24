package ti.dabble.services.mail;

import ti.dabble.entities.User;
import ti.dabble.enums.EmailType;
import ti.dabble.enums.Role;
import ti.dabble.repositories.UserRepository;
import ti.dabble.services.redis.IRedisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailService implements IMailService {
    @Autowired
    private IRedisService redisService;
    @Value("${base_url}")
    private String baseUrl;
    @Value("${client_url}")
    private String clientUrl;
    @Value("${admin_url}")
    private String adminUrl;
    @Value("${spring.mail.username}")
    private String sendMailFrom;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private UserRepository userRepository;
    @Value("${token.expiration-minutes:5}")
    private String tokenExpirationMinutes;

    @Override
    public boolean sendMail(String to, String subject, String templateName, Map<String, Object> data) {
        try {
            MimeMessage message = this.mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String from = sendMailFrom;
            if (from == null || from.isEmpty()) {
                from = "huan.tdb1132@aptechlearning.edu.vn";
            }
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            Context context = new Context();
            context.setVariables(data);
            String htmlContent = this.templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);
            this.mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendMailAndCreateTokens(String email, EmailType typeOfMail) {
        try {
            Duration expiration = Duration.ofMinutes(Long.parseLong(tokenExpirationMinutes));
            String token = UUID.randomUUID().toString();
            String url = "";
            if (typeOfMail.getPath().equalsIgnoreCase("reset-password")) {
                User user = userRepository.findByEmail(email);
                if (user == null) {
                    return false;
                }
                if (!user.getRoleId().equalsIgnoreCase(String.valueOf(Role.USER.getId()))) {
                    url = adminUrl + "auth/" + typeOfMail.getPath() + "/" + token;
                } else {
                    url = clientUrl + typeOfMail.getPath() + "/" + token;
                }
            } else if (typeOfMail.getPath().equalsIgnoreCase("verify-account")) {
                url = clientUrl + typeOfMail.getPath() + "/" + token;
            }
            // Tạo một Map để chứa các biến cho template
            Map<String, Object> data = new HashMap<>();
            data.put("expirationMinutes", tokenExpirationMinutes);
            data.put("url", url);
            if (sendMail(
                    email,
                    typeOfMail.getSubject(),
                    "email_templates/" + typeOfMail.getTemplateName(),
                    data)) {
                redisService.set(token, email, expiration);
                redisService.set(email, token, expiration);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }
}
