self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('f4s-v3').then((cache) => cache.addAll([
      '/flowers-app/',
      '/flowers-app/index.html',
      '/flowers-app/manifest.json',
      '/flowers-app/icon.svg'
    ]))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== 'f4s-v3').map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open('f4s-v3').then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
