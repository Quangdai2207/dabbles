# ===== BUILD =====
FROM maven:latest AS build
WORKDIR /build
COPY pom.xml .
## install and loads maven tools
RUN mvn -B dependency:go-offline
COPY . .
RUN mvn package

# ===== RUN =====
## Load openJDK & runtimes
FROM eclipse-temurin:21-jre
WORKDIR /app

## Copy jar for app runtime
COPY --from=build /build/target/AppMigrations-1.0-SNAPSHOT.jar .

## PORT define
EXPOSE 80
ENTRYPOINT ["java", "-jar", "./AppMigrations-1.0-SNAPSHOT.jar"]
