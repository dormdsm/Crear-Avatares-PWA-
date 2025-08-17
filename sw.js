const CACHE = 'crear-avatares-v1';
const ASSETS = [
  './','./index.html','./css/styles.css','./js/db.js','./js/app.js',
  './icons/icon-192.png','./icons/icon-512.png',
  'https://unpkg.com/dexie@3.2.4/dist/dexie.min.js'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
