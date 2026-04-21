/* VT Shield — Service Worker v4.0 */
const CACHE = 'vt-shield-v4';
const SHELL = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Don't cache VirusTotal API calls — always go network
  if (e.request.url.includes('virustotal.com')) return;
  // Don't cache fonts — use network-first with fallback
  if (e.request.url.includes('fonts.googleapis') || e.request.url.includes('fonts.gstatic')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Handle share_target file sharing (PWA)
self.addEventListener('fetch', e => {
  if (e.request.method === 'POST' && e.request.url === self.location.origin + '/') {
    e.respondWith(
      (async () => {
        const fd = await e.request.formData();
        const file = fd.get('file');
        const client = await self.clients.get(e.clientId);
        if (client && file) {
          client.postMessage({ type: 'SHARE_TARGET', file });
        }
        return Response.redirect('/', 303);
      })()
    );
  }
});
