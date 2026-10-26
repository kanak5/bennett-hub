#!/usr/bin/env python3
"""
Bennett Student Hub — Local Development Server
Run with: python server.py
Then open: http://localhost:8080
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    """Serves all routes to index.html for SPA client-side routing."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        # Check if this is a real file or directory
        url_path = self.path.split('?')[0]
        file_path = os.path.join(DIRECTORY, url_path.lstrip('/'))
        
        # If it's a real file, serve it normally
        if os.path.isfile(file_path):
            return super().do_GET()
        
        # Otherwise, serve index.html for SPA routing
        self.path = '/index.html'
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Cleaner logging."""
        print(f"  {self.client_address[0]} — {format % args}")

def main():
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"\n{'='*50}")
        print(f"  Bennett Student Hub — Dev Server")
        print(f"{'='*50}")
        print(f"  Local:  http://localhost:{PORT}")
        print(f"  Root:   {DIRECTORY}")
        print(f"  Press Ctrl+C to stop")
        print(f"{'='*50}\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
