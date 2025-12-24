const CACHE_VERSION = "v2";
const CACHE_NAME = `qr-bilet-${CACHE_VERSION}`;
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./css/style.css",
    "./js/app.js",
    "./js/modules/overlay.js",
    "./js/modules/route-editor.js",
    "./js/modules/transport-selector.js",
    "./js/modules/tc-rules.js",
    "./js/modules/tc-editor.js",
    "./js/modules/datetime.js",
    "./js/modules/state-manager.js"
];

self.addEventListener("install", (e) => {
    console.log('[Service Worker] Installing...');
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS);
            })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    console.log('[Service Worker] Activating...');
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    const req = e.request;

    // Пропускаем не-GET запросы
    if (req.method !== "GET") {
        e.respondWith(fetch(req));
        return;
    }

    e.respondWith(
        caches.match(req).then(cachedRes => {
            if (cachedRes) {
                return cachedRes;
            }

            // Если нет в кеше, запрашиваем из сети
            return fetch(req).then(netRes => {
                // Кешируем успешные ответы
                if (req.method === "GET" && netRes.ok) {
                    const resClone = netRes.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, resClone);
                    });
                }
                return netRes;
            }).catch(() => {
                // Fallback для навигационных запросов
                if (req.mode === 'navigate') {
                    return caches.match("./index.html");
                }
                // Для остальных - возвращаем ошибку
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});
