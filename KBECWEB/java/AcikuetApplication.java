package org.acikuet;

/**
 * ============================================================================
 * acikuet.org - Java Enterprise Backend Reference Implementation
 * Compatible with Java 17 / 21 & Spring Boot / Built-in com.sun.net.httpserver
 * ============================================================================
 */

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class AcikuetApplication {
    private static final int PORT = 8081;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Status API
        server.createContext("/api/status", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String response = "{\"status\":\"online\",\"engine\":\"Java-Backend-Engine\",\"chapter\":\"ACI KUET Chapter\",\"domain\":\"acikuet.org\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            }
        });

        // Register API
        server.createContext("/api/register", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    
                    Files.writeString(Paths.get("registrations.json"), body + "\n", 
                        StandardOpenOption.CREATE, StandardOpenOption.APPEND);

                    String response = "{\"success\":true,\"message\":\"Application saved in Java Backend!\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                    byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, bytes.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(bytes);
                    }
                } else {
                    exchange.sendResponseHeaders(405, -1);
                }
            }
        });

        server.setExecutor(null); // default executor
        System.out.println("=======================================================");
        System.out.println(" ACI KUET Java Microservice running on port: " + PORT);
        System.out.println(" URL: http://localhost:" + PORT + "/api/status");
        System.out.println("=======================================================");
        server.start();
    }
}
