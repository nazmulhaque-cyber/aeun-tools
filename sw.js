// AEUN Tools — shared service worker (cache: aeun-tools-v3)
var CACHE = 'aeun-tools-v4';
var CORE = [
  './', 'index.html', 'core.js',
  'aeun-memo-maker-download.html','aeun-profit-calculator.html','aeun-post-kit.html',
  'aeun-baki-khata.html','aeun-poster-maker.html','aeun-appointment-book.html',
  'aeun-cv-maker.html','aeun-qr-maker.html','aeun-photo-kit.html','aeun-link-page.html',
  'aeun-stock-book.html','aeun-order-bot.html',
  'fonts/Bornomala-Regular.ttf','fonts/Bornomala-Bold.ttf',
  'aeun-icon-192.png','aeun-icon-512.png'
];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k !== CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        return res;
      }).catch(function(){ return caches.match('aeun-memo-maker-download.html'); });
    })
  );
});
