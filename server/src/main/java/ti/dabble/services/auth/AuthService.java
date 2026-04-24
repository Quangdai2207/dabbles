package ti.dabble.services.auth;

import ti.dabble.dtos.ProfileUserDto;
import ti.dabble.entities.User;
import ti.dabble.enums.EmailType;
import ti.dabble.enums.Role;
import ti.dabble.helpers.FileHelper;
import ti.dabble.repositories.UserFollowedCategoryRepository;
import ti.dabble.repositories.UserRepository;
import ti.dabble.repositories.UserSubscriptionRepository;
import ti.dabble.requests.*;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusAuth;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.jwt.IJwtService;
import ti.dabble.services.mail.IMailService;
import ti.dabble.services.redis.IRedisService;
import ti.dabble.services.wallet.IWalletService;

import com.cloudinary.Cloudinary;
import com.github.f4b6a3.uuid.UuidCreator;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFollowedCategoryRepository userFollowedCategoryRepository;

    @Autowired
    private IJwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    @Autowired
    private IWalletService walletService;

    @Autowired
    private IMailService mailService;

    @Autowired
    private IRedisService redisService;

    @Autowired
    private ModelMapper mapper;
    @Autowired
    private Cloudinary cloudinary;
    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${avatar-url}")
    private String avatarUrl;

    @Override
    public StatusAuth login(LoginRequest loginRequest) {
        StatusAuth statusAuth = new StatusAuth();
        statusAuth.setIsSuccess(false);
        statusAuth.setErrorMessage("");
        statusAuth.setMessage("");
        statusAuth.setAccountId(null);
        statusAuth.setExpires(0);
        statusAuth.setToken(null);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                User user = userRepository.findByEmail(loginRequest.getEmail());
                if (user != null) {
                    String token = jwtService.generateToken(user);
                    if (user.isActive()) {
                        statusAuth.setIsSuccess(true);
                        statusAuth.setErrorMessage("");
                        statusAuth.setMessage("Login Success");
                        statusAuth.setAccountId(user
                                .getId().toString());
                        statusAuth.setExpires(3600);
                        statusAuth.setToken(token);
                    } else {
                        statusAuth.setErrorMessage(
                                "Account is not active. A new verification link has been sent to your email");
                        mailService.sendMailAndCreateTokens(user.getEmail(), EmailType.ACCOUNT_VERIFICATION);
                    }
                    return statusAuth;
                }
                statusAuth.errorMessage = "User not found";
                return statusAuth;
            } else {
                statusAuth.setErrorMessage("Email or password is not correct");
                return statusAuth;
            }

        } catch (BadCredentialsException e) {
            statusAuth.setErrorMessage("Email or password is not correct");
            return statusAuth;
        }
    }

    @Override
    @Transactional
    public StatusAuth loginWithGoogle(GoogleLoginRequest googleLoginRequest) {
        StatusAuth statusAuth = new StatusAuth(false, null, "Google authentication failed", "", "", 0);
        if (googleClientId == null) {
            statusAuth.setErrorMessage("Google client id is not found");
            return statusAuth;
        }
        // 1. Khởi tạo GoogleIdTokenVerifier
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = null;
        try {
            // 2. Xác thực token từ request
            idToken = verifier.verify(googleLoginRequest.getIdToken());
        } catch (GeneralSecurityException | IOException e) {
            statusAuth.setErrorMessage("Invalid Google token");
            return statusAuth;
        }

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String avatarUrl = (String) payload.get("picture");
            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = createNewGoogleUser(email, firstName, lastName, avatarUrl);
                walletService.createDefaultWallet(user);
            } else {
                if (user.getAvatar() == null || user.getAvatar()
                        .isEmpty()) {
                    user.setAvatar(avatarUrl);
                    userRepository.save(user);
                }
            }
            String token = jwtService.generateToken(user);

            statusAuth.setIsSuccess(true);
            statusAuth.setMessage("Login Success");
            statusAuth.setErrorMessage("");
            statusAuth.setAccountId(user.getId().toString());
            statusAuth.setToken(token);
            statusAuth.setExpires(3600);
            return statusAuth;

        } else {
            statusAuth.setErrorMessage("Invalid ID token.");
            return statusAuth;
        }
    }

    @Override
    public Status logout(String token) {
        Status status = new Status(false, "", "");
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Date expirationDate = jwtService.extractExpiration(token);
            long now = System.currentTimeMillis();
            long remainingTime = expirationDate.getTime() - now;

            if (remainingTime > 0) {
                redisService.set(token, "blacklisted", Duration.ofMillis(remainingTime));
            }

            status.setIsSuccess(true);
            status.setMessage("Logout successfully");
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }

    @Override
    public StatusObject<ProfileUserDto> profile(String userEmail) {
        StatusObject<ProfileUserDto> statusObject = new StatusObject<>(false, "", "", null);
        try {
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                statusObject.setErrorMessage("User not found");
                return statusObject;
            }
            boolean isFollowCategories = userFollowedCategoryRepository.existsByUserId(user.getId());
            LocalDateTime endDate = userSubscriptionRepository.getExpiredDayOfUser(user.getId(), LocalDateTime.now());
            ProfileUserDto profileUserDto = mapper.map(user, ProfileUserDto.class);
            profileUserDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, profileUserDto.getAvatar()));
            profileUserDto.setExpiredDay(endDate);
            profileUserDto.setFollowedCategories(isFollowCategories);
            statusObject.setSuccess(true);
            statusObject.setMessage("User found");
            statusObject.setData(profileUserDto);
        } catch (Exception e) {
            statusObject.setErrorMessage("An unexpected error occurred: " + e.getMessage());
            return statusObject;
        }
        return statusObject;
    }

    private User createNewGoogleUser(
            String email,
            String firstName,
            String lastName,
            String avatarUrl) {

        String randomUsername;
        while (true) {
            int random = ThreadLocalRandom.current()
                    .nextInt(1, 9999999);
            String username = "Username" + random;
            if (!userRepository.existsByUsername(username)) {
                randomUsername = username;
                break;
            }
        }
        String randomPassword = FileHelper.generatePassword(12);
        User newUser = new User();
        newUser.setUsername(randomUsername);
        newUser.setEmail(email);
        newUser.setFirstname(firstName);
        newUser.setLastname(lastName);
        newUser.setActive(true);
        newUser.setRoleId(String.valueOf(Role.USER.getId()));
        newUser.setAvatar(avatarUrl);
        newUser.setPassword(passwordEncoder.encode(randomPassword));

        Map<String, Object> map = new HashMap<>();
        map.put("name", newUser.getFirstname() + " " + newUser.getLastname());
        map.put("password", randomPassword);
        mailService.sendMail(email, "Welcome to Dabble!",
                "email_templates/welcome.html",
                map);
        return userRepository.saveAndFlush(newUser);
    }

    @Transactional
    public StatusObject<ProfileUserDto> register(RegisterRequest registerRequest) {
        StatusObject<ProfileUserDto> statusObject = new StatusObject<>(false, "", "", null);

        if (userRepository.existsByPhone(registerRequest.getPhone())) {
            statusObject.setErrorMessage("Phone already exists");
            return statusObject;
        }
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            statusObject.setErrorMessage("Username already exists");
            return statusObject;
        }
        User existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser != null) {
            if (existingUser.isActive()) {
                statusObject.setErrorMessage("Email is already registered");
            } else {
                if (redisService.exists(existingUser.getEmail())) {
                    statusObject.errorMessage = "An activation link has already been sent recently. Please check your email.";
                    return statusObject;
                }
                statusObject.errorMessage = mailService.sendMailAndCreateTokens(existingUser.getEmail(),
                        EmailType.ACCOUNT_VERIFICATION)
                        ? "Account already exists but is not active. A new verification link has been sent to your email"
                        : "Failed to send verification email";

            }
            return statusObject;
        }

        User user = new User();
        user.setId(UuidCreator.getTimeOrderedEpoch());
        user.setFirstname(registerRequest.getFirstName());
        user.setUsername(registerRequest.getUsername());
        user.setLastname(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setAvatar(avatarUrl + registerRequest.getFirstName() + "+" + registerRequest.getLastName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setActive(false);
        user.setPublic(false);
        user.setRoleId(String.valueOf(Role.USER.getId()));

        LocalDateTime endDate = userSubscriptionRepository.getExpiredDayOfUser(user.getId(), LocalDateTime.now());
        ProfileUserDto profileUserDto = mapper.map(user, ProfileUserDto.class);
        profileUserDto.setAvatar(FileHelper.getAvatarUrl(cloudinary, profileUserDto.getAvatar()));
        profileUserDto.setExpiredDay(endDate);

        if (mailService.sendMailAndCreateTokens(user.getEmail(), EmailType.ACCOUNT_VERIFICATION)) {
            userRepository.saveAndFlush(user);

            // boardService.createDefaultBoardForUser(user);
            walletService.createDefaultWallet(user);
            statusObject.setSuccess(true);
            statusObject.setMessage("User created successfully! Please check your mail to activate your account");
            statusObject.setData(profileUserDto);
        } else {
            statusObject.setErrorMessage("Created failed");
        }
        return statusObject;
    }

    @Override
    public Status verify(TokenRequest tokenRequest) {
        Status status = new Status();
        status.setIsSuccess(false);
        status.setErrorMessage("");
        status.setMessage("");
        try {
            boolean isExistToken = redisService.exists(tokenRequest.getToken());
            if (isExistToken) {
                Object value = redisService.get(tokenRequest.getToken());
                if (value != null) {
                    String email = value.toString();
                    User user = userRepository.findByEmail(email);
                    if (user != null) {
                        user.setActive(true);
                        userRepository.save(user);
                        redisService.delete(tokenRequest.getToken());
                        redisService.delete(user.getEmail());
                        status.setIsSuccess(true);
                        status.setMessage("Verified successfully");
                        return status;
                    }
                }
            }
        } catch (Exception e) {
            status.setErrorMessage("This link has been expired or invalid");
            return status;
        }
        status.setErrorMessage("This link has been expired or invalid");
        return status;
    }

    @Override
    public Status forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        Status status = new Status();
        status.isSuccess = false;
        status.message = "";
        status.errorMessage = "";
        if (userRepository.existsByEmail(forgotPasswordRequest.getEmail())) {
            if (!redisService.exists(forgotPasswordRequest.getEmail())) {
                if (mailService.sendMailAndCreateTokens(forgotPasswordRequest.getEmail(), EmailType.PASSWORD_RESET)) {
                    status.isSuccess = true;
                    status.message = "If an account with this email exists, a password reset link has been sent";
                    return status;
                }
                status.errorMessage = "Failed to send reset password email";
                return status;
            }
            status.errorMessage = "Reset password mail has been sent and still valid, please check your mail to reset";
            return status;
        }
        status.errorMessage = "If an account with this email exists, a password reset link has been sent";
        return status;
    }

    @Override
    @Transactional
    public Status resetPassword(
            ResetPasswordRequest resetPasswordRequest) {
        Status status = new Status();
        status.isSuccess = false;
        status.message = "";
        status.errorMessage = "";
        boolean isExistToken = redisService.exists(resetPasswordRequest.getToken());
        if (isExistToken) {
            Object value = redisService.get(resetPasswordRequest.getToken());
            if (value != null) {
                String email = value.toString();
                User user = userRepository.findByEmail(email);
                if (user != null) {
                    user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
                    userRepository.save(user);
                    redisService.delete(resetPasswordRequest.getToken());
                    redisService.delete(user.getEmail());
                    status.isSuccess = true;
                    status.message = "Password reset successfully";
                    return status;
                }
            }
        }
        status.errorMessage = "This link has been expired or invalid";
        return status;
    }

    @Override
    public Status isValidToken(TokenRequest tokenRequest) {
        Status status = new Status(false, "", "");
        try {
            if (redisService.exists(tokenRequest.getToken())) {
                status.setMessage("Valid token");
                status.setIsSuccess(true);
                return status;
            }
            status.setErrorMessage("Invalid token or has expired");
            return status;
        } catch (Exception exception) {
            status.setErrorMessage(exception.getMessage());
            return status;
        }

    }

}
