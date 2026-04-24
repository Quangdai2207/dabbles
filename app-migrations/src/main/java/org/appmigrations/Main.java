package org.appmigrations;

import org.flywaydb.core.Flyway;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.LogManager;

public class Main {
    public static void main(String[] args) {
        try {
            LogManager.getLogManager().reset();

            Properties props = new Properties();
            try (InputStream input = Main.class.getClassLoader().getResourceAsStream("flyway.properties")) {
                if (input == null) {
                    throw new RuntimeException("❌ flyway.properties NOT FOUND in resources!");
                }
                props.load(input);
            }

            Flyway flyway = Flyway.configure()
                    .configuration(props)
                    // QUAN TRỌNG: Đảm bảo Flyway tìm thấy cả SQL và Java migrations
                    // "classpath:db/migration" là nơi chứa file .sql và .java (sau khi compile)
                    .locations("classpath:db/migration")
                    .load();

            flyway.clean();

            var result = flyway.migrate();


        } catch (Exception e) {
            System.err.println("❌ Migration failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
