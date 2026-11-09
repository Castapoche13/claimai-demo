// Klerio : rend la console installable comme une application. Aucun cache : chaque ouverture charge la dernière version.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
