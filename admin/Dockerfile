## Build Maven and load dependencies
FROM maven:latest AS build
WORKDIR /build
COPY pom.xml .
## install and loads maven tools
RUN mvn -B dependency:go-offline
COPY . .
RUN mvn package

## Load openJDK & runtimes
FROM eclipse-temurin:21-jre
WORKDIR /app

## Copy jar for app runtime
COPY --from=build /build/target/FE_Admin-0.0.1-SNAPSHOT.jar .

## apt update and install curl tool
RUN apt-get update && \
    apt-get install -y curl

## install nodejs by curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

## Copy package.json and package-lock.json into container
COPY ./package*.json .
## install dependence packages
RUN npm install

## PORT define
EXPOSE 8668

## Jar run app
ENTRYPOINT ["java", "-jar", "./FE_Admin-0.0.1-SNAPSHOT.jar"]