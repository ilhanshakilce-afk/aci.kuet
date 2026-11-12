#!/usr/bin/env python3
"""
acikuet.org - Python 3 HTTP Server & API Mock
"""
import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 8080

class AcikuetHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = {
                "status": "online",
                "engine": "Python-HTTP-Server",
                "chapter": "American Concrete Institute KUET Chapter",
                "domain": "acikuet.org"
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        if self.path == '/api/register':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            with open("registrations.json", "a") as f:
                f.write(post_data + "\n")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            resp = {"success": True, "message": "Saved successfully!"}
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return

        self.send_error(404, "Endpoint not found")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), AcikuetHandler) as httpd:
        print(f"\n=======================================================")
        print(f"  acikuet.org Python Server Running on port {PORT}")
        print(f"  URL: http://localhost:{PORT}")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
