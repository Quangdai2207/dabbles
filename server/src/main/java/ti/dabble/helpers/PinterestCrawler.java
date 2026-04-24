package ti.dabble.helpers;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import io.github.bonigarcia.wdm.WebDriverManager;
import net.coobird.thumbnailator.Thumbnails;

public class PinterestCrawler {
    private static final List<String> ART_DESCRIPTIONS = Arrays.asList(
            // --- Cảm xúc & Trừu tượng ---
            "A stunning masterpiece that captures the essence of creativity.",
            "Visual poetry expressed through vibrant colors and textures.",
            "An inspiring work of art that speaks to the soul.",
            "The perfect blend of imagination and artistic skill.",
            "A beautiful representation of abstract emotion.",
            "Where colors dance and lines tell a silent story.",
            "Art is not what you see, but what you make others see.",
            "A vivid exploration of light, shadow, and perspective.",
            "Creativity takes courage, and this piece shows it all.",
            "An artistic journey into the depths of imagination.",
            "Pure aesthetic pleasure captured in a single image.",
            "A whisper of beauty in a noisy world.",
            "The details in this artwork are simply mesmerizing.",
            "A chaotic yet harmonious blend of shapes and hues.",
            "Abstract expressionism that challenges the viewer's perspective.",

            // --- Vẻ đẹp & Thẩm mỹ ---
            "A timeless piece that brings elegance to any space.",
            "Capturing the fleeting moments of beauty in a frame.",
            "A visual escape into a world of fantasy.",
            "The subtle gradient of colors creates a dreamlike atmosphere.",
            "A striking composition defined by high contrast and bold strokes.",
            "Nature's beauty reimagined through an artistic lens.",
            "A landscape that feels both familiar and otherworldly.",
            "The organic flow of nature captured in brushstrokes.",
            "Bringing the outdoors inside with this artistic rendering.",
            "A floral symphony rendered in exquisite detail.",

            // --- Phong cách & Kỹ thuật ---
            "Less is more: a study in minimalist beauty.",
            "Simple lines, profound impact.",
            "The elegance of simplicity captured in art.",
            "A clean, modern aesthetic that calms the mind.",
            "Stripped back to the essentials of form and color.",
            "A digital masterpiece pushing the boundaries of imagination.",
            "Future-facing art for the modern collector.",
            "Complex patterns that reveal new details upon every look.",
            "A surrealist journey into the depths of the mind.",
            "Vibrant aesthetics for the contemporary soul.",

            // --- Sâu sắc & Ấn tượng ---
            "Rich textures that you can almost feel with your eyes.",
            "A layered composition full of depth and intrigue.",
            "Intricate details that showcase the artist's dedication.",
            "A feast for the eyes, rich in detail and color.",
            "An explosion of color that brightens up the room.",
            "A timeless classic reimagined for today.",
            "Art that tells a story without saying a word.",
            "The raw energy of creation frozen in time.",
            "Grace, beauty, and artistic vision combined.",
            "A bold statement piece for the discerning eye.",
            "Where reality meets imagination.",
            "Mastering the interplay of darkness and illumination.",
            "Evoking a sense of nostalgia and timeless wonder.",
            "A piece that resonates with deep, unspoken feelings.",
            "Serenity and chaos captured within a single frame.");

    private static final List<String> DECORATION_DESCRIPTIONS = Arrays.asList(
            "A cozy living room with warm wooden furniture, soft lighting, and neutral tones creating a relaxing atmosphere.",
            "Modern minimalist house decoration featuring clean lines, white walls, and carefully arranged furniture.",
            "Scandinavian-style interior with light wood floors, pastel colors, and natural sunlight filling the space.",
            "Elegant home decor with marble accents, gold details, and luxurious velvet sofas.",
            "Vintage-inspired living space with antique furniture, classic paintings, and warm earthy colors.",
            "Bohemian house decoration featuring colorful cushions, layered textiles, and handmade accessories.",
            "Industrial-style apartment with exposed brick walls, metal furniture, and dark muted tones.",
            "Cozy bedroom decorated with soft fabrics, warm bedside lighting, and minimalist wall art.",
            "Modern luxury living room with large windows, high ceilings, and stylish contemporary furniture.",
            "Japanese-style interior featuring natural wood, tatami mats, and a calm, Zen atmosphere.",
            "Farmhouse-style home with rustic wooden furniture, neutral colors, and cozy decorative details.",
            "Bright and airy living space decorated with white curtains, indoor plants, and light-colored furniture.",
            "Classic European-style interior with elegant moldings, chandeliers, and sophisticated decor.",
            "Modern apartment decorated with smart storage solutions and space-saving furniture.",
            "Warm home decor featuring earth tones, wooden textures, and soft ambient lighting.",
            "Artistic living room with abstract paintings, unique furniture, and creative decorative accents.",
            "Luxury bedroom decorated with silk bedding, gold details, and soft indirect lighting.",
            "Minimalist bedroom with neutral colors, simple furniture, and a clutter-free layout.",
            "Mediterranean-style home with white walls, blue accents, and natural stone elements.",
            "Modern kitchen decor featuring sleek cabinets, marble countertops, and warm lighting.",
            "Cozy reading corner with a comfortable armchair, floor lamp, and wooden bookshelf.",
            "Urban-style apartment with dark walls, modern lighting, and contemporary artwork.",
            "Traditional Asian home decoration with wooden furniture and cultural decorative elements.",
            "Soft and feminine bedroom decor with pastel colors, floral accents, and elegant furniture.",
            "Luxury living room with panoramic windows, premium materials, and modern design.",
            "Creative home decor combining modern furniture with vintage decorative accessories.",
            "Natural-style interior decorated with bamboo furniture and green indoor plants.",
            "Warm family living room with comfortable sofas and inviting decorative details.",
            "Modern monochrome interior with black, white, and gray color tones.",
            "Cozy small apartment decor designed to maximize space and comfort.",
            "High-end interior with custom furniture and premium decorative finishes.",
            "Relaxing home decor inspired by nature with wood, stone, and soft fabrics.",
            "Contemporary living space with geometric patterns and stylish lighting fixtures.",
            "Simple yet elegant home decoration with neutral colors and clean layouts.",
            "Luxury apartment interior with glass elements and modern architectural design.",
            "Romantic bedroom decor featuring soft lighting and elegant curtains.",
            "Art-deco inspired interior with bold patterns and rich decorative details.",
            "Warm rustic home decor with natural wood and handcrafted accessories.",
            "Modern loft-style apartment with open space and industrial details.",
            "Peaceful home interior designed for relaxation and comfort.",
            "Stylish living room with statement furniture and modern decor accents.",
            "Minimalist home decor focusing on functionality and simplicity.",
            "Elegant dining room decorated with modern furniture and warm lighting.",
            "Soft neutral home interior creating a calm and welcoming environment.",
            "Creative apartment decor mixing colors, textures, and modern furniture.",
            "Luxury villa interior with spacious layout and high-end decorations.",
            "Comfortable home decor designed for everyday living and relaxation.",
            "Modern cozy home with balanced lighting and harmonious color palette",
            "Timeless house decoration combining classic elegance and modern comfort",
            "Chic urban apartment decor with contemporary furniture and stylish accents",
            "Relaxing home decor with natural wood, soft lighting, and cozy furniture",
            "Minimalist living room with clean lines and neutral colors");

    private static final List<String> LUXURY_CAR_DESCRIPTIONS = Arrays.asList(
            "Luxury sports car elegance",
            "Premium automotive perfection",
            "High-end performance vehicle",
            "Ultimate luxury driving experience",
            "Sophisticated supercar design",
            "Elite automotive craftsmanship",
            "Modern luxury sports car",
            "Exclusive high-performance automobile",
            "Prestige luxury car styling",
            "Powerful elegant supercar",

            "Premium class automotive design",
            "Iconic luxury car presence",
            "Refined performance luxury vehicle",
            "Executive luxury car appeal",
            "High-status automotive excellence",
            "Timeless luxury car design",
            "Elite supercar engineering",
            "Ultra-luxury driving machine",
            "Premium sports car aesthetics",
            "Supreme automotive craftsmanship",

            "Luxury car with attitude",
            "High-performance luxury machine",
            "Prestige-class sports automobile",
            "Exclusive luxury car styling",
            "Modern elite supercar",
            "Luxury meets performance",
            "Refined speed and elegance",
            "Ultimate premium sports car",
            "Luxury automotive masterpiece",
            "Elite road presence",

            "High-end supercar performance",
            "Luxury power and precision",
            "Premium driving perfection",
            "Sophisticated automotive luxury",
            "Exclusive supercar experience",
            "Luxury engineered excellence",
            "Modern performance luxury",
            "Elite automotive design language",
            "Prestigious luxury vehicle",
            "Refined supercar aesthetics",

            "Luxury speed and style",
            "Premium elite automobile",
            "High-status supercar presence",
            "Luxury driving masterpiece",
            "Elite performance vehicle",
            "Refined luxury engineering",
            "Ultimate supercar elegance",
            "Exclusive premium supercar",
            "Luxury automotive icon",
            "Prestige performance automobile");
    private static final List<String> TECHNOLOGY_DESCRIPTIONS = Arrays.asList(
            "Advanced digital technology",
            "Cutting-edge tech innovation",
            "Future-ready smart technology",
            "High-tech digital solutions",
            "Modern technology evolution",
            "Next-generation tech systems",
            "Smart technology integration",
            "Innovative digital transformation",
            "Intelligent tech solutions",
            "Advanced software engineering",

            "Artificial intelligence innovation",
            "Machine learning technology",
            "Cloud computing solutions",
            "Big data analytics",
            "Internet of things technology",
            "Blockchain digital technology",
            "Cybersecurity technology solutions",
            "High-performance computing",
            "Digital automation systems",
            "Smart device technology",

            "Future technology concepts",
            "Advanced digital infrastructure",
            "Modern computing technology",
            "Intelligent automation platforms",
            "Scalable tech architecture",
            "Digital innovation ecosystem",
            "Next-level technology experience",
            "Smart digital transformation",
            "Advanced networking technology",
            "Intelligent system design",

            "Virtual reality technology",
            "Augmented reality innovation",
            "Digital twin technology",
            "Edge computing solutions",
            "Quantum computing research",
            "Smart AI systems",
            "Digital security infrastructure",
            "High-speed data processing",
            "Cloud-native technology",
            "Modern software solutions",

            "Innovative tech architecture",
            "Technology-driven solutions",
            "Future-focused digital design",
            "Intelligent digital platforms",
            "Advanced tech ecosystem",
            "Next-gen digital intelligence",
            "Smart scalable technology",
            "Digital innovation leadership",
            "Next-level tech innovation",
            "Digital transformation excellence",
            "Future-proof tech solutions",
            "Smart digital solutions",
            "Advanced AI technology",
            "Cutting-edge digital systems",
            "High-tech innovation hub",
            "Modern intelligent technology",
            "Next-generation digital solutions",
            "Innovative technology strategies",
            "Future-ready tech platforms",
            "Smart technology advancements",
            "Advanced digital experiences",
            "Cutting-edge technology trends",
            "High-performance tech innovations",
            "Modern digital ecosystems",
            "Next-level intelligent systems",
            "Innovative digital strategies",
            "Future-focused technology solutions",
            "Smart tech innovation center",
            "Advanced technology development",
            "Cutting-edge digital innovation",
            "High-tech digital transformation",
            "Modern intelligent solutions",
            "Next-generation tech innovation",
            "Innovative intelligent technology",
            "Future-ready digital systems",
            "Smart technology evolution",
            "Advanced digital technology trends");

    private static final List<String> NATURE_DESCRIPTIONS = Arrays.asList(
            "Beautiful natural landscape",
            "Peaceful nature scenery",
            "Serene outdoor environment",
            "Untouched natural beauty",
            "Calm nature atmosphere",
            "Majestic mountain scenery",
            "Lush green forest",
            "Tranquil lakeside view",
            "Golden sunset landscape",
            "Fresh morning nature",

            "Wild nature beauty",
            "Scenic countryside view",
            "Natural outdoor harmony",
            "Pure natural environment",
            "Peaceful forest landscape",
            "Flowing river scenery",
            "Vast open fields",
            "Misty mountain morning",
            "Green meadow landscape",
            "Soothing nature vibes",

            "Nature-inspired tranquility",
            "Calm wilderness scenery",
            "Natural scenic beauty",
            "Serene coastal landscape",
            "Blue sky and clouds",
            "Rolling hills landscape",
            "Sunlight through trees",
            "Quiet natural retreat",
            "Fresh air nature",
            "Peaceful outdoor escape",

            "Natural harmony and balance",
            "Gentle ocean waves",
            "Forest path scenery",
            "Blooming spring nature",
            "Autumn forest colors",
            "Snowy mountain landscape",
            "Peaceful riverside view",
            "Nature calm and quiet",
            "Sunrise over mountains",
            "Natural outdoor serenity",

            "Wild green paradise",
            "Untouched wilderness beauty",
            "Calming nature moments",
            "Natural earth tones",
            "Green nature sanctuary",
            "Peaceful natural world",
            "Scenic natural escape",
            "Pure nature essence",
            "Tranquil nature retreat",
            "Beautiful outdoor scenery",

            "Nature-inspired tranquility",
            "Calm wilderness scenery",
            "Natural scenic beauty",
            "Serene coastal landscape",
            "Blue sky and clouds",
            "Rolling hills landscape",
            "Sunlight through trees",
            "Quiet natural retreat",
            "Fresh air nature",
            "Peaceful outdoor escape");

    // ===== CONFIG =====
   private static final String CLOUD_NAME = "drr9qndwx"; 
    private static final String API_KEY = "624949777732477";
    private static final String API_SECRET = "iGXKRLcbmnYOlE9vsDwG-F5ivKQ";
    
    private static Cloudinary cloudinary;

    // ===== CẤU HÌNH CRAWLER =====
    private static final int TARGET_IMAGE_COUNT = 50; 
    private static final int MIN_CRAWL_WIDTH = 500;
    // URL Search Luxury Cars
    private static final String SEARCH_URL = "https://www.pinterest.com/search/pins/?q=AI%20technology%20wallpaper&rs=typed";

    // ===== DATABASE =====
    private static final String DB_URL = "jdbc:mysql://27.78.77.132:9307/dabble_huan_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DB_USER = "dabble_huan_user";
    private static final String DB_PASS = "dabble_huan_password";

    // ===== FIXED UUIDs =====
    private static final String CREATOR_ID = "018f2a93-1c12-7a9f-8c11-2b3e4d5f6a03"; // UUID creator
    private static final String TARGET_CATEGORY_ID = "018f2a91-6d3d-7e0f-8c11-4a9b2d7e5f33"; // UUID category
    private static final String FOLDER_NAME = "dabble/images";

    // ===== MODEL =====
    static class ImageMetadata {
        String id;       // UUID (không có dấu gạch ngang để làm tên file)
        String fileName; // Tên file đầy đủ (VD: dabble/images/abc_original.webp)
        int width;
        int height;
        long fileSize;

        ImageMetadata(String id, String fileName, int width, int height, long fileSize) {
            this.id = id;
            this.fileName = fileName;
            this.width = width;
            this.height = height;
            this.fileSize = fileSize;
        }
    }

    public static void main(String[] args) {
        // 1. Khởi tạo Cloudinary
        initCloudinary();

        // 2. Crawl & Upload
        List<ImageMetadata> images = crawlAndUploadImages();

        // 3. Lưu vào DB
        if (!images.isEmpty()) {
            saveToDatabase(images);
        } else {
            System.out.println("⚠️ Không tải được hình nào.");
        }
    }

    private static void initCloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", CLOUD_NAME);
        config.put("api_key", API_KEY);
        config.put("api_secret", API_SECRET);
        config.put("secure", "true");
        cloudinary = new Cloudinary(config);
        System.out.println("✅ Kết nối Cloudinary thành công!");
    }

    // =========================================================
    // ================== CRAWL + UPLOAD =======================
    // =========================================================
    private static List<ImageMetadata> crawlAndUploadImages() {
        List<ImageMetadata> list = new ArrayList<>();
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-notifications", "--start-maximized");
        // options.addArguments("--headless"); // Bật dòng này nếu không muốn hiện trình duyệt

        WebDriver driver = new ChromeDriver(options);

        try {
            System.out.println("🌐 Đang truy cập Pinterest...");
            driver.get(SEARCH_URL);

            Set<String> imageUrls = new HashSet<>();
            JavascriptExecutor js = (JavascriptExecutor) driver;

            // --- Vòng lặp lấy Link ---
            int attempts = 0;
            while (imageUrls.size() < TARGET_IMAGE_COUNT + 10 && attempts < 20) {
                attempts++;
                
                // Xóa popup khó chịu của Pinterest
                try {
                    js.executeScript("const popups = document.querySelectorAll('[data-test-id=\"giftWrap\"], .UnauthBanner, div[data-test-id=\"signup-step-container\"]'); popups.forEach(p => p.remove());");
                } catch (Exception ignored) {}

                List<WebElement> images = driver.findElements(By.tagName("img"));
                for (WebElement img : images) {
                    try {
                        String src = img.getAttribute("src");
                        // Logic lấy ảnh chất lượng cao hơn từ thumbnail
                        if (src != null && src.contains("pinimg.com/236x/")) {
                            imageUrls.add(src.replace("/236x/", "/564x/"));
                        } else if (src != null && src.contains("pinimg.com/564x/")) {
                            imageUrls.add(src);
                        }
                    } catch (StaleElementReferenceException ignored) {}
                }

                // Cuộn trang
                js.executeScript("window.scrollBy(0, window.innerHeight * 2);");
                Thread.sleep(1500); 

                System.out.println("... Đã tìm thấy: " + imageUrls.size() + " links (Target: " + TARGET_IMAGE_COUNT + ")");
                if (imageUrls.size() >= TARGET_IMAGE_COUNT + 10) break;
            }

            // --- Vòng lặp Tải và Upload ---
            System.out.println("--> Bắt đầu tải và upload lên Cloudinary...");
            int counter = 0;
            
            for (String urlStr : imageUrls) {
                if (counter >= TARGET_IMAGE_COUNT) break;

                try {
                    // 1. Tải ảnh về RAM (BufferedImage)
                    BufferedImage original = downloadImage(urlStr);

                    if (original == null || original.getWidth() < MIN_CRAWL_WIDTH) continue;

                    // 2. Tạo ID ngẫu nhiên
                    String rawUuid = UUID.randomUUID().toString(); // VD: "550e8400-e29b..."
                    String cleanId = rawUuid.replace("-", "");     // VD: "550e8400e29b..."

                    // 3. Upload lên Cloudinary
                    ImageMetadata metadata = uploadToCloudinary(original, cleanId);
                    
                    if (metadata != null) {
                        list.add(metadata);
                        System.out.println("✅ Saved [" + (++counter) + "] " + cleanId);
                    }

                } catch (Exception e) {
                    System.err.println("❌ Lỗi xử lý ảnh: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) driver.quit();
        }
        return list;
    }

    // =========================================================
    // ================== CLOUDINARY UPLOAD ====================
    // =========================================================
    private static ImageMetadata uploadToCloudinary(BufferedImage original, String imageId) throws IOException {
        
        // Convert BufferedImage sang byte[] để upload
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(original, "webp", baos); // Convert sang webp luôn
        byte[] imageBytes = baos.toByteArray();

        int MAX_ORIGINAL_WIDTH = 2560;

        try {
            String fileNameToSave = FileHelper.generateFileNameForImage();
            // Upload bản GỐC (Authenticated)
            Map uploadResultOriginal = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                    "public_id", fileNameToSave,
                    "folder", FOLDER_NAME,       // "dabble/images"
                    "type", "authenticated",     // <--- BẢO MẬT
                    "resource_type", "image",
                    "format", "webp",
                    "quality", "90",
                    "transformation", new Transformation().width(MAX_ORIGINAL_WIDTH).crop("limit")
            ));

            int finalWidth = (Integer) uploadResultOriginal.get("width");
            int finalHeight = (Integer) uploadResultOriginal.get("height");
            long finalSize = Long.parseLong((uploadResultOriginal.get("bytes").toString()));

            // Lưu tên file theo format: "dabble/images/{uuid}_original.webp" 
            // Hoặc "images/{uuid}_original.webp" tùy logic cắt chuỗi của bạn
            // Ở đây tôi lưu "dabble/images/..." cho an toàn, hàm setUrlImages của bạn đã có logic cắt

            return new ImageMetadata(
                    imageId, // UUID clean
                    fileNameToSave,
                    finalWidth,
                    finalHeight,
                    finalSize);

        } catch (Exception e) {
            System.err.println("Cloudinary Upload Error: " + e.getMessage());
            return null;
        }
    }

    // =========================================================
    // ================== DOWNLOAD HELPER ======================
    // =========================================================
    private static BufferedImage downloadImage(String urlString) {
        HttpURLConnection connection = null;
        try {
            URL url = new URL(urlString);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            connection.setRequestProperty("Referer", "https://www.pinterest.com/");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                try (InputStream is = connection.getInputStream()) {
                    return ImageIO.read(is);
                }
            }
        } catch (Exception e) {
            // System.err.println("Download fail: " + urlString);
        } finally {
            if (connection != null) connection.disconnect();
        }
        return null;
    }

    // =========================================================
    // ================== DATABASE =============================
    // =========================================================
    private static void saveToDatabase(List<ImageMetadata> images) {
        String insertImageSql = """
                    INSERT INTO images
                    (id, creator_id, description, image_url, price,
                     width, height, format, file_size,
                     like_count, is_public, created_date, is_deleted)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        String insertCatSql = """
                    INSERT INTO images_categories
                    (image_id, category_id, created_date)
                    VALUES (?, ?, ?)
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             PreparedStatement psImg = conn.prepareStatement(insertImageSql);
             PreparedStatement psCat = conn.prepareStatement(insertCatSql)) {

            conn.setAutoCommit(false);
            Timestamp now = Timestamp.valueOf(LocalDateTime.now());
            Random rand = new Random();

            for (ImageMetadata img : images) {
                // 1. Tạo UUID dạng chuẩn (có gạch ngang) cho ID Database
                // img.id là dạng clean (không gạch), ta cần format lại hoặc tạo mới
                // Tốt nhất là tạo UUID từ clean string để đồng bộ
                UUID uuidStandard = FileHelper.randomPastUuid(60);

                // Chọn mô tả ngẫu nhiên
                String randomDesc = TECHNOLOGY_DESCRIPTIONS.get(rand.nextInt(TECHNOLOGY_DESCRIPTIONS.size()));
                
                // Giá ngẫu nhiên 10 -> 100
                BigDecimal randomPrice = BigDecimal.valueOf(10 + (90 * rand.nextDouble()));

                // Insert Image
                psImg.setString(1, uuidStandard.toString());        // ID (UUID chuẩn)
                psImg.setString(2, CREATOR_ID);          // Creator
                psImg.setString(3, randomDesc);          // Description
                psImg.setString(4, img.fileName);        // image_url: "dabble/images/..."
                psImg.setBigDecimal(5, randomPrice);
                psImg.setInt(6, img.width);
                psImg.setInt(7, img.height);
                psImg.setString(8, "webp");
                psImg.setLong(9, img.fileSize);
                psImg.setInt(10, rand.nextInt(500)); // Like count giả
                psImg.setBoolean(11, true);              // is_public
                psImg.setTimestamp(12, now);
                psImg.setBoolean(13, false);             // is_deleted
                psImg.addBatch();

                // Insert Category
                psCat.setString(1, uuidStandard.toString());
                psCat.setString(2, TARGET_CATEGORY_ID);
                psCat.setTimestamp(3, now);
                psCat.addBatch();
            }

            psImg.executeBatch();
            psCat.executeBatch();
            conn.commit();

            System.out.println("🚀 DONE! Đã lưu " + images.size() + " hình vào Database.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}