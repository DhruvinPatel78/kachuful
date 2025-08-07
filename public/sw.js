// Service Worker for Kachuful Scoreboard PWA
// Online-only strategy - no offline caching

const CACHE_NAME = 'kachuful-v1';
const ONLINE_ONLY_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Install event - minimal setup for online-only
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - online-only strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // Always try network first for online-only behavior
    fetch(event.request)
      .then((response) => {
        // If successful, return the response
        if (response.ok) {
          return response;
        }
        throw new Error('Network response was not ok');
      })
      .catch((error) => {
        console.log('Service Worker: Network request failed:', error);
        
        // For navigation requests, show offline page
        if (event.request.mode === 'navigate') {
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - Kachuful</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                  color: white;
                  margin: 0;
                  padding: 0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }
                .container {
                  max-width: 400px;
                  padding: 2rem;
                }
                .icon {
                  font-size: 4rem;
                  margin-bottom: 1rem;
                }
                h1 {
                  font-size: 1.5rem;
                  margin-bottom: 1rem;
                  color: #ef4444;
                }
                p {
                  color: #94a3b8;
                  margin-bottom: 2rem;
                  line-height: 1.5;
                }
                button {
                  background: #10b981;
                  color: white;
                  border: none;
                  padding: 0.75rem 1.5rem;
                  border-radius: 0.5rem;
                  font-size: 1rem;
                  cursor: pointer;
                  transition: background-color 0.2s;
                }
                button:hover {
                  background: #059669;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="icon">🃏</div>
                <h1>You're Offline</h1>
                <p>Kachuful Scoreboard requires an internet connection to work properly. Please check your connection and try again.</p>
                <button onclick="window.location.reload()">Try Again</button>
              </div>
            </body>
            </html>
          `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // For other requests, just fail
        throw error;
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});