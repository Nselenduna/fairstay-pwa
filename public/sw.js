// This is a placeholder service worker file
// next-pwa will generate the actual service worker file

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Placeholder for fetch event handling
// next-pwa will handle this
self.addEventListener('fetch', (event) => {
  // Default fetch handling
  event.respondWith(fetch(event.request));
}); 