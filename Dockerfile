# ---------- STAGE 1: BUILD ----------
FROM gradle:8.5.0-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test --no-daemon

# ---------- STAGE 2: FINAL RUNTIME WITH FULL JDK ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Install glibc compatibility for java.desktop if needed
RUN apk add --no-cache libc6-compat

# Copy built JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "app.jar"]
