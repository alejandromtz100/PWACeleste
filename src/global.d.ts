// src/global.d.ts
interface ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}
