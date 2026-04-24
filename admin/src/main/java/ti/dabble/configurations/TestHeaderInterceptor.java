package ti.dabble.configurations;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Component
public class TestHeaderInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        // Get All Header to check pairs
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            String value = request.getHeader(name);
            System.out.println(name + " = " + value);
        }

        String IP_USER_TRUSTED = request.getRemoteAddr(); // Get root IP via network connection form request client
        String IP_PROXY = request.getHeader("X-Forwarded-For"); // Get IP attacker maybe set manual within header request
        System.out.println("IP ROOT: " +  IP_USER_TRUSTED);
        System.out.println("IP PROXY: " +  IP_PROXY);
        return true;
    }

}
