const CACHE_NAME = 'smartlessa-v2';
const ASSETS = [
  './',
  './index.html',
  './src/main.js',
  './src/config.js',
  './src/i18n.js',
  // ... інші критичні файли
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Стратегія: Cache First для ассетів, Network First для HTML
  if (e.request.url.match(/\.(mp4|png|jpg|mp3|webm)$/i)) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  } else {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
