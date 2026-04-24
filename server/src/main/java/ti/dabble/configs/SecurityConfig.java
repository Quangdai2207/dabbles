package ti.dabble.configs;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import ti.dabble.filters.JwtAuthFilter;
import ti.dabble.handlers.CustomAccessDeniedHandler;
import ti.dabble.handlers.CustomAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // --- 1. SỬA LỖI CORS: KHÔNG ĐƯỢC DISABLE ---
                // Thay vì disable, ta cấu hình source cho nó
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers(
                                        // Plan
                                        "/api/plan/get-all-plans",
                                        "/api/plan/get-plan-by-id/{id}",
                                        // Auth
                                        "/api/auth/**", 
                                        "/api/payment/**",
                                        // Category
                                        "/api/category/get-all-categories",
                                        "/api/category/get-category-by-id/{categoryId}",
                                        // Image
                                        "/api/image/get-image-by-id/{id}",
                                        "/api/image/get-all-images-by-user/{userId}",
                                        "/api/image/get-images-for-home-page",
                                        "/api/image/get-comments-by-image/{imageId}",
                                        "/api/image/get-all-like-images-of-user/",
                                        "/api/image/search-by-keyword",

                                        // User
                                        "/api/user/profile-user-with-image/{userId}",
                                        "/api/user/search-by-username/{username}",
                                        // Comment
                                        "/api/comment/get-comments-by-image/{imageId}",
                                        // Contact
                                        "/api/contact/get-all-followers-of-user/{userId}",
                                        "/api/contact/get-all-followings-of-user/{userId}",
                                        "/swagger-ui.html",
                                        "/v3/api-docs/**",
                                        "/swagger-ui/**",
                                        "/",
                                        "/ws/**")
                                .permitAll()
                                .requestMatchers("/api/wallet-transaction/**")
                                .hasRole("USER")
                                .requestMatchers("/api/contact/**")
                                .hasAnyRole("USER", "ADMIN", "SUPERADMIN")

                                .requestMatchers("/api/like/**")
                                .hasAnyRole("USER")

                                .requestMatchers("/api/category/get-followed-categories-by-user")
                                .hasRole("USER")
                                .requestMatchers("/api/category/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN")
                                .requestMatchers("/api/payment/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN")

                                .requestMatchers("/api/user/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN", "USER")

                                .requestMatchers("/api/conversation/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN", "USER")

                                .requestMatchers("/api/comment/**")
                                .hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/api/chat/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN", "USER")
                                .requestMatchers("/api/image/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN", "USER")

                                .requestMatchers("/api/admin/update-role")
                                .hasRole("SUPERADMIN")

                                .requestMatchers("/api/admin/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN")

                                // .requestMatchers("/api/board/**")
                                // .hasRole("USER")
                                .requestMatchers("/api/fee/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN")
                                .requestMatchers("/api/plan/**")
                                .hasAnyRole("ADMIN", "SUPERADMIN")
                                .requestMatchers("/api/paypal/**")
                                .hasRole("USER")
                                .requestMatchers("/api/user-subscription/**")
                                .hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                                .anyRequest()
                                .authenticated())

                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- 3. THÊM BEAN CẤU HÌNH CORS ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:8668",
                "http://localhost:3000"));

        // Cho phép các method
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cho phép Header (Authorization, Content-Type...)
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Captcha-Token",
                "X-VerifyAccount-Token",
                "X-ResetPassword-Token",
                "X-Register-Token"));

        // Cho phép gửi Cookie/Credential (quan trọng cho WebSocket và Auth sau này)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}