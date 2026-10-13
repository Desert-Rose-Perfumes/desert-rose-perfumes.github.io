// Service worker wersji hostowanej (https): aplikacja otwiera się bez zasięgu.
// Najpierw pamięć podręczna (natychmiastowy start), w tle pobranie świeżej wersji – nowe dane widać przy następnym otwarciu.
const CACHE = 'doradca-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add('./'))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    if (!hit) return net;
    e.waitUntil(net.catch(() => {}));
    return hit;
  }));
});
