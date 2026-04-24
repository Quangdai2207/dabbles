package db.migration;

import com.github.f4b6a3.uuid.UuidCreator;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.PreparedStatement;
import java.util.UUID;

public class V21__Seed_Default_Data extends BaseJavaMigration {

    @Override
    public void migrate(Context context) throws Exception {

        // 1. Insert Roles
        String insertRoleSql = "INSERT INTO roles (id, name) VALUES (?, ?)";

        try (PreparedStatement psRole = context.getConnection()
                .prepareStatement(insertRoleSql)) {
            // Role 1: SUPERADMIN
            psRole.setInt(1, 1);
            psRole.setString(2, "ROLE_SUPERADMIN");
            psRole.addBatch();

            // Role 2: ADMIN
            psRole.setInt(1, 2);
            psRole.setString(2, "ROLE_ADMIN");
            psRole.addBatch();

            // Role 3: USER
            psRole.setInt(1, 3);
            psRole.setString(2, "ROLE_USER");
            psRole.addBatch();

            psRole.executeBatch();
        }

        // 2. Insert Users
        String insertUserSql = "INSERT INTO users " +
                "(id, firstname, lastname, email, phone, avatar, password, role_id, bio, warning ,is_public, is_active, created_date, username) "
                +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)";

        // Password "123" đã mã hóa (BCrypt)
        String hashedPassword = "$2a$12$GzlZWM1g2VUBC0Ch8YKOFuRKzWdBl/uKIcfQVPsaqut5eY5vjpT5m";

        try (PreparedStatement psUser = context.getConnection()
                .prepareStatement(insertUserSql)) {

            // --- User 1: Super Admin ---
            psUser.setString(1,
                    "018f2a93-1c10-7b21-9a3d-4e8c1f2a9b01");
            psUser.setString(2, "Super");
            psUser.setString(3, "Admin");
            psUser.setString(4, "superadmin@app.com");
            psUser.setString(5, "0901000001");
            psUser.setString(6, "https://ui-avatars.com/api/?name=Super+Admin");
            psUser.setString(7, hashedPassword); // Đã sửa lỗi thiếu ngoặc kép
            psUser.setString(8, "1");
            psUser.setString(9, "Deo co gi ma coi dau may thang lon");
            psUser.setInt(10, 0);
            psUser.setBoolean(11, true);
            psUser.setBoolean(12, true);
            psUser.setString(13, "superadmin");
            psUser.addBatch();

            // --- User 2: Admin ---
            psUser.setString(1,
                    "018f2a93-1c11-7e45-b8c2-9d1a3f4e5b02");
            psUser.setString(2, "Manager");
            psUser.setString(3, "Admin");
            psUser.setString(4, "admin@app.com");
            psUser.setString(5, "0901000002");
            psUser.setString(6, "https://ui-avatars.com/api/?name=Admin");
            psUser.setString(7, hashedPassword);
            psUser.setString(8, "2");
            psUser.setString(9, "Cc");
            psUser.setInt(10, 0);
            psUser.setBoolean(11, true);
            psUser.setBoolean(12, true);
            psUser.setString(13, "admin");
            psUser.addBatch();

            // --- User 3: Normal User ---
            psUser.setString(1,
                    "018f2a93-1c12-7a9f-8c11-2b3e4d5f6a03");
            psUser.setString(2, "Normal");
            psUser.setString(3, "User");
            psUser.setString(4, "user@app.com");
            psUser.setString(5, "0901000003");
            psUser.setString(6, "https://ui-avatars.com/api/?name=Normal+User");
            psUser.setString(7, hashedPassword);
            psUser.setString(8, "3");
            psUser.setString(9, "Stalk con cac");
            psUser.setInt(10, 0);
            psUser.setBoolean(11, true);
            psUser.setBoolean(12, true);
            psUser.setString(13, "user");
            psUser.addBatch();

            psUser.executeBatch();
        }

        String insertCategorySql = """
                    INSERT INTO categories
                    (id, name, slug, description, is_featured, is_deleted)
                    VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (PreparedStatement psCategory = context.getConnection()
                .prepareStatement(insertCategorySql)) {

            // Category 1: Nghệ thuật
            psCategory.setString(1,
                    "018f2a91-6d3b-7c4a-9f21-1b3a9d8c2e10");
            psCategory.setString(2, "Art");
            psCategory.setString(3, "art");
            psCategory.setString(4, "Creative art");
            psCategory.setBoolean(5, true); // is_featured
            psCategory.setBoolean(6, false); // is_deleted
            psCategory.addBatch();

            // Category 2: Thiên nhiên
            psCategory.setString(1,
                    "018f2a91-6d3c-7a91-b4e2-7c9d1f3a8b22");
            psCategory.setString(2, "Natural");
            psCategory.setString(3, "natural");
            psCategory.setString(4, "Natural science");
            psCategory.setBoolean(5, false);
            psCategory.setBoolean(6, false);
            psCategory.addBatch();

            // Category 3: Công nghệ
            psCategory.setString(1,
                    "018f2a91-6d3d-7e0f-8c11-4a9b2d7e5f33");
            psCategory.setString(2, "Technology");
            psCategory.setString(3, "technology");
            psCategory.setString(4, "Information and Technology");
            psCategory.setBoolean(5, false);
            psCategory.setBoolean(6, false);
            psCategory.addBatch();

            psCategory.setString(1,
                    "018f2a91-6d3d-7f1a-2d12-2a3b9f7c1a52");
            psCategory.setString(2, "Luxury car");
            psCategory.setString(3, "luxury-car");
            psCategory.setString(4, "Luxury cars in the world");
            psCategory.setBoolean(5, false);
            psCategory.setBoolean(6, false);
            psCategory.addBatch();

            psCategory.setString(1,
                    "018f2a91-6d3d-7c2d-3c16-5b3c8a9c2b15");
            psCategory.setString(2, "Decoration");
            psCategory.setString(3, "decoration");
            psCategory.setString(4, "Decoration to make your place more beautiful");
            psCategory.setBoolean(5, false);
            psCategory.setBoolean(6, false);
            psCategory.addBatch();

            psCategory.executeBatch();
            System.out.println("✅ Inserted Categories");
        }
    }
}