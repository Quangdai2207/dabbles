package ti.dabble.helpers;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.github.f4b6a3.uuid.UuidCreator;

public class FileHelper {
    public static Long convertDateToLong(String dateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate date = LocalDate.parse(dateStr, formatter);
        String formatted = date.format(DateTimeFormatter.ofPattern("ddMMyyyy"));

        return Long.parseLong(formatted);
    }

    public static String generateFileNameForImage() {
        return UuidCreator.getTimeOrderedEpoch()
                .toString()
                .replace("-", "");
    }

    public static String generateSlug(String name) {
        if (name == null) {
            return "";
        }

        // 1. Chuyển thành chữ thường
        String slug = name.toLowerCase();

        // 2. Chuẩn hóa chuỗi Unicode để tách các dấu thanh ra khỏi chữ cái gốc
        // Ví dụ: "ệ" sẽ tách thành "e" + dấu nặng + dấu mũ
        slug = Normalizer.normalize(slug, Normalizer.Form.NFD);

        // 3. Dùng Regex để loại bỏ các dấu thanh (các ký tự trong dải Combining
        // Diacritical Marks)
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        slug = pattern.matcher(slug).replaceAll("");

        // 4. Thay thế chữ Đ/đ thành d (vì Normalizer đôi khi không xử lý chữ đ)
        slug = slug.replace("đ", "d");

        // 5. Xóa các ký tự đặc biệt (chỉ giữ lại chữ cái, số và khoảng trắng)
        // Bước này giúp loại bỏ dấu phẩy, dấu chấm... ví dụ: "nghệ thuật, và đời sống"
        slug = slug.replaceAll("[^a-z0-9\\s-]", "");

        // 6. Thay thế nhiều khoảng trắng liên tiếp bằng 1 dấu gạch ngang
        // \s+ nghĩa là 1 hoặc nhiều khoảng trắng
        slug = slug.replaceAll("\\s+", "-");

        return slug;
    }

    public static BufferedImage addLogoWatermark(BufferedImage originalImage, BufferedImage logoImage, float opacity)
            throws IOException {

        Graphics2D g2d = (Graphics2D) originalImage.getGraphics();

        // 2. Cấu hình độ trong suốt
        // Lưu ý: Vì để ở giữa nên cần mờ hơn để khách còn nhìn thấy ảnh (VD: 0.2f)
        AlphaComposite alphaChannel = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, opacity);
        g2d.setComposite(alphaChannel);

        int mainWidth = originalImage.getWidth();
        int mainHeight = originalImage.getHeight();

        // 3. TÍNH KÍCH THƯỚC LOGO (Scale)
        // Để ở giữa thì nên cho to hơn một chút, ví dụ 1/3 (33%) chiều rộng ảnh gốc
        int targetLogoWidth = mainWidth / 3;

        // Tính chiều cao giữ nguyên tỷ lệ
        int targetLogoHeight = (int) ((double) logoImage.getHeight() * targetLogoWidth / logoImage.getWidth());

        // 4. TÍNH TỌA ĐỘ (X, Y) ĐỂ RA GIỮA (CENTER)
        int x = (mainWidth - targetLogoWidth) / 2;
        int y = (mainHeight - targetLogoHeight) / 2;

        // 5. Vẽ logo
        g2d.drawImage(logoImage, x, y, targetLogoWidth, targetLogoHeight, null);

        g2d.dispose();
        return originalImage;
    }

    public static BigDecimal calculateFee(
            BigDecimal amount,
            BigDecimal percent) {
        return amount
                .multiply(percent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public static String generatePassword(int length) {
        String LOWER = "abcdefghijklmnopqrstuvwxyz";
        String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String DIGIT = "0123456789";
        String SPECIAL = "@#$%&*!?";

        SecureRandom random = new SecureRandom();
        if (length < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        List<Character> passwordChars = new ArrayList<>();

        // Bắt buộc mỗi loại ít nhất 1 ký tự
        passwordChars.add(LOWER.charAt(random.nextInt(LOWER.length())));
        passwordChars.add(UPPER.charAt(random.nextInt(UPPER.length())));
        passwordChars.add(DIGIT.charAt(random.nextInt(DIGIT.length())));
        passwordChars.add(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        String allChars = LOWER + UPPER + DIGIT + SPECIAL;

        // Sinh các ký tự còn lại
        for (int i = 4; i < length; i++) {
            passwordChars.add(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Trộn thứ tự để không predictable
        Collections.shuffle(passwordChars);

        StringBuilder password = new StringBuilder();
        for (char c : passwordChars) {
            password.append(c);
        }

        return password.toString();
    }

    public static UUID randomPastUuid(int maxDaysAgo) {
        if (maxDaysAgo <= 0) {
            return UuidCreator.getTimeOrderedEpoch(); // Trả về thời điểm hiện tại nếu tham số sai
        }

        long maxMillisOffset = maxDaysAgo * 24L * 60 * 60 * 1000;

        // Random từ 0 đến maxMillisOffset
        long randomOffset = ThreadLocalRandom.current().nextLong(0, maxMillisOffset);

        Instant pastInstant = Instant.now().minusMillis(randomOffset);

        return UuidCreator.getTimeOrderedEpoch(pastInstant);
    }

    public static BigDecimal randomBigDecimal(double min, double max) {
        double value = ThreadLocalRandom.current().nextDouble(min, max);
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    public static boolean isEnglishText(String text) {
        if (text == null)
            return false;

        // Chỉ cho phép ký tự Latin cơ bản + punctuation
        return text.matches("^[a-zA-Z0-9 .,!?\"'()\\-]+$");
    }

    public static String getAvatarUrl(Cloudinary cloudinary, String avatarPath) {
        String AVATAR_FOLDER = "dabble/avatars";
        if (avatarPath == null || avatarPath.isEmpty())
            return null;

        if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
            return avatarPath;
        }


        return cloudinary.url()
                .transformation(new Transformation()
                        .width(736).crop("limit").quality("80").fetchFormat("webp"))
                .generate(AVATAR_FOLDER + "/" + avatarPath);
    }

    public static String getImageUrl(Cloudinary cloudinary, String uuid) {
        // g_center: Ở giữa
        String LOGO_ID = "dabble:avatars:logo";
        String IMAGE_FOLDER = "dabble/images";
        String watermarkConfig = "l_" + LOGO_ID + ",w_0.15,fl_relative,o_50,g_center";

        return cloudinary.url()
                .type("authenticated")
                .signed(true)
                .transformation(new Transformation()
                        .width(236).crop("scale").quality("80").fetchFormat("webp")
                        .chain()
                        .rawTransformation(watermarkConfig) // Dùng chuỗi raw cho an toàn
                )
                .generate(IMAGE_FOLDER + "/" + uuid);
    }

    public static String formatFullName(String firstname, String lastname) {
        if (firstname != null && lastname != null) {
            return firstname.trim() + " " + lastname.trim();
        } else if (firstname != null) {
            return firstname.trim();
        } else if (lastname != null) {
            return lastname.trim();
        } else {
            return ""; // Return empty string if both are null
        }
    }

}