self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('savidya-tv-v2').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/sw.js'
      ]).catch(function() { /* ignore */ });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

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