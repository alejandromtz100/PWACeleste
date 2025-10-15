const APP_SHELL_CACHE = "appShell_v1.2";
const DYNAMIC_CACHE = "dynamic_v1.2";
const APP_SHELL_FILES = [
  "/", "/index.html", "/src/index.css", "/src/App.tsx", "/icon-192.png", "/icon-512.png"
];

// ✅ Instalar Service Worker y cachear recursos básicos
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES)));
  self.skipWaiting();
});

// ✅ Activar nuevo SW y limpiar cachés viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE) caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// ✅ Interceptar peticiones GET para servir desde cache o red
self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const respClone = resp.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, respClone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

// ✅ Escuchar el evento de sincronización en background
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-logins") {
    console.log("🔁 Intentando reenviar logins guardados...");
    event.waitUntil(syncPendingLogins());
  }
});

// ✅ Reenviar logins pendientes cuando hay conexión
async function syncPendingLogins() {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open("offlineDB", 1);
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });

  const tx = db.transaction("pendingLogins", "readwrite");
  const store = tx.objectStore("pendingLogins");
  const allReq = store.getAll();

  const all = await new Promise((resolve, reject) => {
    allReq.onsuccess = () => resolve(allReq.result);
    allReq.onerror = reject;
  });

  for (const item of all) {
    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.data),
      });

      if (res.ok) {
        store.delete(item.id);
        console.log("✅ Login reenviado y eliminado:", item);
      }
    } catch (error) {
      console.warn("❌ Error al reenviar login:", error);
    }
  }

  // Esperar a que termine la transacción
  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });

  db.close();
}
