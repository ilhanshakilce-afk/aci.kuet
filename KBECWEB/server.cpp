/**
 * ============================================================================
 * acikuet.org - High Performance Native C++ HTTP Web Server & REST API Engine
 * Standard: C++17
 * Built for ACI KUET Student Chapter Portal
 * ============================================================================
 */

#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#include <vector>
#include <map>
#include <thread>
#include <mutex>
#include <cstring>
#include <cstdlib>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

constexpr int PORT = 8080;
constexpr int BUFFER_SIZE = 65536;

std::mutex g_mutex;

// Helper to deduce MIME type
std::string get_mime_type(const std::string& path) {
    if (path.rfind(".html") != std::string::npos) return "text/html; charset=utf-8";
    if (path.rfind(".css") != std::string::npos) return "text/css; charset=utf-8";
    if (path.rfind(".js") != std::string::npos) return "application/javascript; charset=utf-8";
    if (path.rfind(".json") != std::string::npos) return "application/json; charset=utf-8";
    if (path.rfind(".svg") != std::string::npos) return "image/svg+xml";
    if (path.rfind(".png") != std::string::npos) return "image/png";
    if (path.rfind(".jpg") != std::string::npos || path.rfind(".jpeg") != std::string::npos) return "image/jpeg";
    if (path.rfind(".ico") != std::string::npos) return "image/x-icon";
    return "text/plain; charset=utf-8";
}

// Read binary or text file from disk
bool read_file(const std::string& filepath, std::string& content) {
    std::ifstream file(filepath, std::ios::in | std::ios::binary);
    if (!file.is_open()) return false;
    std::ostringstream ss;
    ss << file.rdbuf();
    content = ss.str();
    return true;
}

// Save registration entry to server log
void record_registration(const std::string& payload) {
    std::lock_guard<std::mutex> lock(g_mutex);
    std::ofstream out("registrations.json", std::ios::app);
    if (out.is_open()) {
        out << payload << "\n";
    }
}

// Client request worker
void handle_client(int client_socket) {
    char buffer[BUFFER_SIZE];
    memset(buffer, 0, BUFFER_SIZE);

    ssize_t bytes_read = read(client_socket, buffer, BUFFER_SIZE - 1);
    if (bytes_read <= 0) {
        close(client_socket);
        return;
    }

    std::string request_str(buffer, bytes_read);
    std::istringstream req_stream(request_str);
    std::string method, url, http_version;
    req_stream >> method >> url >> http_version;

    // Default route
    if (url == "/" || url.empty()) {
        url = "/index.html";
    }

    // Strip query parameters if present
    size_t q_pos = url.find('?');
    if (q_pos != std::string::npos) {
        url = url.substr(0, q_pos);
    }

    std::ostringstream response;

    // REST API Endpoints
    if (url == "/api/status" && method == "GET") {
        std::string json_body = "{\"status\":\"online\",\"engine\":\"ACI-KUET-C++-Server\",\"version\":\"1.0.0\",\"chapter\":\"American Concrete Institute KUET Chapter\"}";
        response << "HTTP/1.1 200 OK\r\n"
                 << "Content-Type: application/json; charset=utf-8\r\n"
                 << "Access-Control-Allow-Origin: *\r\n"
                 << "Content-Length: " << json_body.length() << "\r\n"
                 << "Connection: close\r\n\r\n"
                 << json_body;
    }
    else if (url == "/api/register" && method == "POST") {
        size_t header_end = request_str.find("\r\n\r\n");
        std::string post_body = (header_end != std::string::npos) ? request_str.substr(header_end + 4) : "";
        
        record_registration(post_body);

        std::string json_body = "{\"success\":true,\"message\":\"Registration saved successfully to ACI KUET Server!\"}";
        response << "HTTP/1.1 200 OK\r\n"
                 << "Content-Type: application/json; charset=utf-8\r\n"
                 << "Access-Control-Allow-Origin: *\r\n"
                 << "Content-Length: " << json_body.length() << "\r\n"
                 << "Connection: close\r\n\r\n"
                 << json_body;
    }
    else {
        // Serve static assets from local directory
        std::string local_path = "." + url;
        std::string file_content;

        if (read_file(local_path, file_content)) {
            std::string mime = get_mime_type(local_path);
            response << "HTTP/1.1 200 OK\r\n"
                     << "Content-Type: " << mime << "\r\n"
                     << "Content-Length: " << file_content.length() << "\r\n"
                     << "Cache-Control: no-cache, no-store, must-revalidate\r\n"
                     << "Pragma: no-cache\r\n"
                     << "Expires: 0\r\n"
                     << "Connection: close\r\n\r\n"
                     << file_content;
        } else {
            std::string not_found_html = "<html><body><h1>404 Not Found - acikuet.org</h1><p>The requested file does not exist.</p></body></html>";
            response << "HTTP/1.1 404 Not Found\r\n"
                     << "Content-Type: text/html; charset=utf-8\r\n"
                     << "Content-Length: " << not_found_html.length() << "\r\n"
                     << "Connection: close\r\n\r\n"
                     << not_found_html;
        }
    }

    std::string resp_str = response.str();
    write(client_socket, resp_str.c_str(), resp_str.length());
    close(client_socket);
}

int main() {
    int server_fd;
    struct sockaddr_in address;
    int opt = 1;

    // Create socket file descriptor
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Reuse address and port
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt))) {
        perror("setsockopt");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    // Bind socket
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    // Listen
    if (listen(server_fd, 100) < 0) {
        perror("listen failed");
        exit(EXIT_FAILURE);
    }

    std::cout << "\n=======================================================\n";
    std::cout << "  ACI KUET Student Chapter C++ Web Server Started!      \n";
    std::cout << "  Domain: acikuet.org                                  \n";
    std::cout << "  Local URL: http://localhost:" << PORT << "                  \n";
    std::cout << "  API Endpoint: http://localhost:" << PORT << "/api/status     \n";
    std::cout << "=======================================================\n\n";

    while (true) {
        sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_sock = accept(server_fd, (struct sockaddr *)&client_addr, &client_len);
        if (client_sock < 0) {
            continue;
        }
        std::thread(handle_client, client_sock).detach();
    }

    close(server_fd);
    return 0;
}
