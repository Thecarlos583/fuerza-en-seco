// Service worker: guarda la app completa la primera vez para que funcione en modo avión.
// Al cambiar cualquier archivo, sube VERSION para que el teléfono descargue lo nuevo.
const VERSION = 'fuerza-en-seco-v10';
const ARCHIVOS = [
  './', './index.html', './manifest.json', './css/styles.css',
  './js/app.js', './js/app-instalar.js', './js/data.js', './js/store.js', './js/fechas.js', './js/plan.js', './js/pesos.js',
  './js/util.js', './js/anim.js', './js/poses.js', './js/timer.js', './js/cuerpo.js', './js/sesion.js', './js/hoy.js', './js/guia.js', './js/ajustes.js', './js/marcas.js', './js/progreso.js', './js/entrenador.js', './js/graficas.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la caché (rápido y sin internet); si hay red, se actualiza en segundo plano
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const guardado = await cache.match(e.request, { ignoreSearch: true });
      const red = fetch(e.request).then(r => {
        if (r.ok) cache.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return guardado || (await red) || (e.request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    })
  );
});

// Tocar una notificación abre (o enfoca) la app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./#hoy')));
});
