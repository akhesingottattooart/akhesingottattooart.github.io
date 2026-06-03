const CACHE_NAME = 'akhesingot-cache-v1';

// Jin files ko aap offline save karna chahte hain unki list
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/bootstrap.css',
  './css/style.css',
  './css/font-awesome.css',
  './js/jquery-2.1.4.min.js',
  './js/bootstrap-3.1.1.min.js'
];

// 1. Install Event: Files ko browser ki cache memory mein save karna
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Naye service worker ko turant activate karne ke liye
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Akhesingot Tattoo site files caching...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate Event: Purane cache ko saaf karna jab aap site update karein
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Pehle Cache se file do, agar nahi hai toh Network se lo (Offline Support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Agar cache mein file mil gayi toh wahi se load karo, nahi toh internet se fetch karo
      return cachedResponse || fetch(event.request);
    })
  );
});
