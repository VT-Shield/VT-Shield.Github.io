/* VT Shield — Service Worker v4.1 */
const CACHE = 'vt-shield-v4.1';
const SHELL = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ─── Unified fetch handler (single listener to avoid conflicts) ─── */
self.addEventListener('fetch', e => {
  const url = e.request.url;
  const parsed = new URL(url);

  /* Share Target: handle POST to app root */
  if (e.request.method === 'POST' && parsed.pathname === '/') {
    e.respondWith((async () => {
      try {
        const fd = await e.request.formData();
        const file = fd.get('file');
        if (file) {
          const buffer = await file.arrayBuffer();
          const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
          for (const client of allClients) {
            client.postMessage(
              { type: 'SHARE_TARGET', name: file.name, size: file.size, fileType: file.type, buffer },
              [buffer]
            );
          }
        }
      } catch (err) { /* silent */ }
      return Response.redirect('/', 303);
    })());
    return;
  }

  /* Never cache VT API or proxy requests */
  if (url.includes('virustotal.com') || url.includes('corsproxy.io') || url.includes('cors.sh')) {
    return;
  }

  /* Network-first for Google Fonts */
  if (url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  /* Cache-first with network fallback for app shell */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => {
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
