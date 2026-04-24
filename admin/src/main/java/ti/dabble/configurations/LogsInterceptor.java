package ti.dabble.configurations;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.security.Principal;
import java.text.SimpleDateFormat;

@Component
public class LogsInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Principal user =  request.getUserPrincipal();
        if (user == null) {
            return true;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String[] userAgentSplot = request.getHeader("User-Agent").split(" ");
        String browserType = userAgentSplot[10];
        System.out.println(browserType);
        return true;
    }
}
