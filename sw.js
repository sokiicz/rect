/* RECT service worker — fresh HTML when online, full offline fallback */
const CACHE = 'rect-v10';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Network-first for navigations / the HTML document — never serve a stale app shell while online.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first for everything else (icons, fonts, manifest), refreshing the cache in the background.
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        try {
          const url = new URL(req.url);
          const cacheable = url.origin === location.origin || /gstatic\.com|googleapis\.com/.test(url.host);
          if (cacheable && res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
        } catch (_) {}
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
