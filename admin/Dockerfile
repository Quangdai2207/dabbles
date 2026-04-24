# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy configuration files
COPY pom.xml .
COPY package.json .
COPY package-lock.json .

# Copy source code
COPY src ./src

# Build the application (this will also trigger frontend build via plugin)
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8668

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
