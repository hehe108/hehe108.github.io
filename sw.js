/** sw.js */
const CACHE_NAME = 'cache-v1';
 
self.addEventListener('install', (event => {
  console.log('---------install-----------', event);
  // event.waitUntil(self.skipWaiting());
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // 资源列表，不要人工获取
        cache.addAll([
          '/',
          './index.css'
        ])
      })
  );
}));
 
self.addEventListener('activate', (event => {
  fetch('./userInfo.json', { method: 'post', body: { a: 1, b: 2 } })
  console.log('--------activate----------', event);
  // event.waitUntil(self.clients.claim());
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        return cacheNames.delete(cacheName);
      }
    }))
  }))
}));
 
self.addEventListener('fetch', (event => {
  console.log('--------fetch---------', event);
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) {
          return response;
        }
 
        // https://stackoverflow.com/questions/68522967/failed-to-execute-put-on-cache-request-method-post-is-unsupported-pwa-s
        if ((event.request.url.indexOf('http') === 0)) {
          return fetch(event.request).then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            if (!event.request.url.endsWith('styles.css')) {
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              console.log('------event.request------', event.request)
              const responseToCache = response.clone();
              cache.put(event.request, responseToCache);
            }
 
            return response;
          })
        }
      })
    })
  )
}))
 
self.addEventListener('push', event => {
  event.waitUntil(
    // Process the event and display a notification.
    self.registration.showNotification("Hey!")
  );
});
 
self.addEventListener('notificationclick', event => {
  // Do something with the event  
  event.notification.close();
});
 
self.addEventListener('notificationclose', event => {
  // Do something with the event  
});

