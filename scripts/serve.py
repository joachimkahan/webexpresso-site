import http.server
import socketserver
import os
import sys

PORT = 8090

class RobustHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    web_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(web_dir)
    print(f"Serving HTTP on 0.0.0.0 port {PORT} from {web_dir}...")
    
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), RobustHandler)
    server.serve_forever()

if __name__ == '__main__':
    main()
