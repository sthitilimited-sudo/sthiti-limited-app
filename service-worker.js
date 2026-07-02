const CACHE = "sthiti-interior-mgmt-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  // Don't cache Supabase API calls — always go to network for data
  if (e.request.url.includes("supabase.co")) return;
  e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match("./index.html"))));
});
