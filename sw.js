const CACHE = "qr-bilet-v1";
const ASSETS = [
    "/qr.bilet.spk/",
    "/qr.bilet.spk/index.html",
    "/qr.bilet.spk/manifest.webmanifest",
    "/qr.bilet.spk/style.css",
    "/qr.bilet.spk/script.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    const req = e.request;
    e.respondWith(
        caches.match(req).then(res => res || fetch(req).then(netRes => {
            if (req.method === "GET" && netRes.ok) {
                const copy = netRes.clone();
                caches.open(CACHE).then(c => c.put(req, copy));
            }
            return netRes;
        }).catch(() => caches.match("/qr.bilet.spk/index.html")))
    );
});
