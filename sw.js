const CACHE_NAME = 'dvizh-kviz-v1';
const ASSETS = [
  'index.html',
  'main.js',
  'logo1.png'
];

// Установка и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Работа в офлайне
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});