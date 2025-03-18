import http.server
import socketserver

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if path.endswith(('.html', '.js', '.css')):
            content_type = 'text/html' if path.endswith('.html') else 'text/javascript' if path.endswith('.js') else 'text/css'
            self.send_response(200)
            self.send_header('Content-Type', f'{content_type}; charset=utf-8')
            self.end_headers()
            return open(path, 'rb', encoding='utf-8')
        return super().send_head()

if __name__ == '__main__':
    PORT = 8000
    with socketserver.TCPServer(("127.0.0.1", PORT), UTF8HTTPRequestHandler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()