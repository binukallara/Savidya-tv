const CACHE_NAME = 'savidya-tv-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

// Install Event
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE).catch(function() { /* ignore */ });
    })
  );
  self.skipWaiting();
});

// Activate Event (പഴയ ക്യാഷുകൾ നീക്കം ചെയ്യുന്നു)
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // വേഷൻ മാറമ്പോൾ പഴയ ക്യാഷ് കളയും
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch Event
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request).catch(function() {
        return new Response('Offline – please check your connection.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
