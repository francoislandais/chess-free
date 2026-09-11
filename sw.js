// Network requests to Lichess, OAuth callbacks and credentials are never cached.
const CACHE='calme-shell-66e7e4b7f2fb';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./manifest.webmanifest','./calme-icon-192.png','./calme-icon-512.png'])));});
// No skipWaiting: an update must never take control during an open game.
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('calme-shell-')&&k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('./',self.registration.scope)).then(r=>r||Response.error())));return;
 }
 if(!/\.(js|css|png|svg|woff2|webmanifest)$/.test(url.pathname))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();void caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));
});
