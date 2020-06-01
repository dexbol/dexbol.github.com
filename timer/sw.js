self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return caches.open('timer').then((cache) => {
                return fetch(event.request).then((response) => {
                    return cache
                        .put(event.request, response.clone())
                        .then(() => {
                            return response;
                        });
                });
            });
        })
    );
});
