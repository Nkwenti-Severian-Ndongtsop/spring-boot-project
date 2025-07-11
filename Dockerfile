FROM gradle:8.5.0-jdk17-alpine AS builder

WORKDIR /app
COPY . .
    
RUN ./gradlew clean build -x test --no-daemon && \
rm -rf ~/.gradle/caches ~/.gradle/wrapper
    
FROM gcr.io/distroless/java17-debian11
    
WORKDIR /app
    
COPY --from=builder /app/build/libs/*.jar app.jar
    
EXPOSE 8000
    
ENTRYPOINT ["java", "-jar", "app.jar"]