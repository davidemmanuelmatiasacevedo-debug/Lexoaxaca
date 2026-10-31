var V="lex-oaxaca-v1",A=["./","index.html","style.css","app.js","data.js","manifest.json"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(A);}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V;}).map(function(x){return caches.delete(x);}));}));});
self.addEventListener("fetch",function(e){e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(ch){ch.put(e.request,c);});return r;}).catch(function(){return caches.match(e.request);}));});
