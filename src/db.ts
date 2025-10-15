// ✅ Manejo de IndexedDB para logins pendientes

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("offlineDB", 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("pendingLogins")) {
        db.createObjectStore("pendingLogins", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("❌ Error abriendo IndexedDB");
  });
}

export async function savePendingLogin(data: any): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("pendingLogins", "readwrite");
  tx.objectStore("pendingLogins").add(data);
  tx.oncomplete = () => db.close();
}

export async function getAllPendingLogins(): Promise<any[]> {
  const db = await openDB();
  const tx = db.transaction("pendingLogins", "readonly");
  const store = tx.objectStore("pendingLogins");
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result);
    };
    req.onerror = () => {
      db.close();
      reject("Error obteniendo pendientes");
    };
  });
}

export async function clearPendingLogin(id: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("pendingLogins", "readwrite");
  tx.objectStore("pendingLogins").delete(id);
  tx.oncomplete = () => db.close();
}
