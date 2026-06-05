package org.appmigrations;

import org.flywaydb.core.Flyway;

public class Main {
    public static void main(String[] args) {
        try {

            String url = "jdbc:mysql://db:3306/dabble?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            String user = "root";
            String password = "12345";

            Flyway flyway = Flyway.configure()
                    .dataSource(url, user, password)
                    .locations("classpath:db/migration")
                    .load();

            System.out.println("🚀 Starting Flyway migration...");

            flyway.migrate();

            System.out.println("✅ Migration completed successfully!");

        } catch (Exception e) {
            System.err.println("❌ Migration failed:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}