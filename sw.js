/* DAYMAR · caché para que la tienda abra rápido. Nunca guarda las páginas (HTML) ni los datos: solo archivos con versión, librerías fijas e imágenes. */
const EST="daymar-est-1",IMG="daymar-img-1",MAX_IMG=200;
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("daymar-")&&x!==EST&&x!==IMG).map(x=>caches.delete(x))))])));
async function recortar(c){const k=await c.keys();if(k.length>MAX_IMG)await Promise.all(k.slice(0,k.length-MAX_IMG).map(x=>c.delete(x)))}
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||r.headers.has("range"))return;let u;try{u=new URL(r.url)}catch(x){return}
 const mismo=u.origin===self.location.origin,p=u.pathname;
 const fijo=/(^|\.)(cdnjs\.cloudflare\.com|fonts\.gstatic\.com|fonts\.googleapis\.com)$/.test(u.hostname);
 const ver=mismo&&u.searchParams.has("v")&&/\.(js|css|png)$/.test(p)&&!/products\.js|sistema\.js/.test(p);
 const img=(mismo&&/\.(jpe?g|png|webp)$/i.test(p)&&!/imagenes\.json/.test(p))||/(^|\.)(daymarsv\.workers\.dev|supabase\.co)$/.test(u.hostname)&&/\.(jpe?g|png|webp)$/i.test(p);
 if(fijo||ver){e.respondWith(caches.open(EST).then(c=>c.match(r).then(h=>h||fetch(r).then(n=>{if(n&&(n.ok||n.type==="opaque"))c.put(r,n.clone()).catch(()=>{});return n}))));return}
 if(img){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(h=>{const red=fetch(r).then(n=>{if(n&&(n.ok||n.type==="opaque")){c.put(r,n.clone()).then(()=>recortar(c)).catch(()=>{})}return n}).catch(()=>h);return h||red})))}
});
