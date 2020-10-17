const filesToCache = [
  '/',
  '/index.html',
  '/assets/css/colors.css',
  '/assets/css/app.css',
  '/assets/images/transfer.jpg'
];

const staticCacheName = 'v1.0.0';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
    .then((cache) => cache.addAll(filesToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
      .then((response) => {
        if (response.status === 404) {
          return caches.match('/404.html');
        }
        return caches.open(staticCacheName)
        .then((cache) => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch((error) => {
      console.log('Error, ', error);
      return '<h1>You are offline</h1>';
    })
  );
});

