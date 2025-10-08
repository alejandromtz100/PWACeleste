import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔹 Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registrado:", registration);
    })
    .catch((err) => {
      console.error("❌ Error al registrar el Service Worker:", err);
    });
}

// 🔹 IndexedDB
const request = window.indexedDB.open("database");

request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  const db = (event.target as IDBOpenDBRequest).result;
  if (!db.objectStoreNames.contains("table")) {
    db.createObjectStore("table", { autoIncrement: true });
  }
};

request.onsuccess = () => {
  console.log("✅ IndexedDB abierto correctamente");
};

request.onerror = () => {
  console.error("❌ Error al abrir IndexedDB");
};
