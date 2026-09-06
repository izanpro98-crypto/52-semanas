/* Service worker de 52 Semanas de Hierro.
   Es lo que hace que la app funcione sin internet.

   Sube el numero de VERSION cada vez que cambies index.html: al detectarlo,
   la app te ofrece actualizar en un aviso abajo y el cache viejo se borra. */
const VERSION = "v2";
const CACHE = "hierro52-" + VERSION;

/* El esqueleto de la app: sin esto no arranca offline. */
const NUCLEO = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      /* de uno en uno: si un fichero fallara, addAll abortaria la instalacion entera */
      .then(c => Promise.all(NUCLEO.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", e => {
  if(e.data === "saltar") self.skipWaiting();
});

const ESTATICO = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;

  const url = new URL(req.url);
  const propio = url.origin === self.location.origin;
  const fuente = ESTATICO.test(req.url);
  if(!propio && !fuente) return;

  /* La pagina: primero la red, para que una version nueva se note al momento;
     si no hay conexion, la copia guardada. */
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(r => {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copia)).catch(() => {});
          return r;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  /* Todo lo demas (iconos, tipografias): primero el cache, que es instantaneo,
     y si no esta se pide a la red y se guarda para la proxima. */
  e.respondWith(
    caches.match(req).then(guardado => {
      if(guardado) return guardado;
      return fetch(req).then(r => {
        /* las tipografias de Google responden opaco en algunos casos;
           se guardan igual, sirven perfectamente al volver a pedirlas */
        if(r && (r.ok || r.type === "opaque")){
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
        }
        return r;
      }).catch(() => guardado);
    })
  );
});
