const APP_SHELL_CACHE = "appShell_v1.0";
const DYNAMIC_CACHE = "dynamic_v1.0";
const APP_SHELL_FILES = [
  "/", 
  "/index.html",
  "/src/index.css",
  "/src/App.tsx"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const respClone = resp.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, respClone);
          });
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
