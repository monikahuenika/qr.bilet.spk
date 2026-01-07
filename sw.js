const CACHE_VERSION = "v9";
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
    "./js/modules/tc-selector.js",
    "./js/modules/datetime.js",
    "./js/modules/state-manager.js",
    "./js/data/tc-numbers.json"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
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

    if (req.method !== "GET") {
        e.respondWith(fetch(req));
        return;
    }

    e.respondWith(
        caches.match(req).then(cachedRes => {
            if (cachedRes) {
                return cachedRes;
            }

            return fetch(req).then(netRes => {
                if (req.method === "GET" && netRes.ok) {
                    const resClone = netRes.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, resClone);
                    });
                }
                return netRes;
            }).catch(() => {
                if (req.mode === 'navigate') {
                    return caches.match("./index.html");
                }
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});
