self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                if (!response || response.status !== 200 || resppon.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();
                caches.open('v1').then(function(cache) {;
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })     
    );
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/capture',
                '/list',
                '/export'
            ]);
        })
    );
});