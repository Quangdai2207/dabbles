package ti.dabble.aspects;

import jakarta.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import ti.dabble.annotations.RateLimit;
import ti.dabble.enums.RateLimitKeyType;
import ti.dabble.exceptions.RateLimitExceededException;
import ti.dabble.services.rate_limit.RateLimitService;

@Aspect
@Component
public class RateLimitAspect {

    private final RateLimitService rateLimitService;

    public RateLimitAspect(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Around("@annotation(rateLimit)")
    public Object handleRateLimit(
            ProceedingJoinPoint joinPoint,
            RateLimit rateLimit
    ) throws Throwable {

        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        String path = request.getRequestURI();

        String identityKey = resolveRateLimitKey(request, rateLimit);


        String redisKey = identityKey + ":" + path;

        boolean allowed = rateLimitService.allow(
                redisKey,
                rateLimit.limit(),
                rateLimit.window()
        );

        if (!allowed) {
            throw new RateLimitExceededException();
        }

        return joinPoint.proceed();
    }

    // ================= PRIVATE METHODS =================

    private String resolveRateLimitKey(
            HttpServletRequest request,
            RateLimit rateLimit
    ) {


        // 1️⃣ Nếu user chọn IP
        if (rateLimit.keyType() == RateLimitKeyType.IP) {
            return "rate_limit:ip:" + getClientIp(request);
        }

        // 2️⃣ DEFAULT: USERNAME
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth != null && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken)) {

            return "rate_limit:user:" + auth.getName();
        }

        // 3️⃣ Fallback: chưa login → IP
        return "rate_limit:ip:" + getClientIp(request);
    }


    private String getClientIp(HttpServletRequest request) {

        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}
