// La app se mudó a /colonias/. Este service worker sustituye al de la dirección antigua:
// borra la copia guardada de la app vieja, se da de baja y lleva las ventanas abiertas a la nueva.
// Los proyectos y placas no se tocan: están guardados para todo xabierplaza.github.io.
// relativa al alcance (…/contador-colonias/ → …/colonias/): mismo dominio, así navigate() funciona
const NUEVA = new URL("../colonias/", self.registration.scope).href;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      for (const clave of await caches.keys()) if (clave.includes("/contador-colonias/")) await caches.delete(clave);
      await self.registration.unregister();
      for (const ventana of await self.clients.matchAll({ type: "window" })) {
        const hash = new URL(ventana.url).hash;
        ventana.navigate(NUEVA + hash).catch(() => undefined);
      }
    })(),
  );
});
