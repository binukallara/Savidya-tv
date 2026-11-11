const CACHE_NAME = 'savidya-tv-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tv.js',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate Event (പഴയ ക്യാഷ് ഡിലീറ്റ് ചെയ്യുന്നു)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: ആദ്യം നെറ്റ്‌വർക്ക്, ഇല്ലെങ്കിൽ ക്യാഷ്
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = req.url;

  // IPTV Stream വീഡിയോ റെക്വസ്റ്റുകൾ ക്യാഷ് ചെയ്യാതിരിക്കാൻ
  if (url.includes('.m3u') || url.includes('.m3u8') || url.includes('.ts')) return;

  // നമ്മുടെ സ്വന്തം ഫയലുകൾ മാത്രം
  if (req.method !== 'GET' || new URL(url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('/index.html');
        })
      )
  );
});
