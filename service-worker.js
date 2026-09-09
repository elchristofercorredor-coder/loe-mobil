/* ==========================================
   LOE MOBIL - SERVICE WORKER
   Notificaciones Push
========================================== */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

/* RECIBIR NOTIFICACIÓN PUSH */

self.addEventListener("push", event => {

  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: "LOE MOBIL",
      body: event.data ? event.data.text() : ""
    };
  }

  const title =
    data.title ||
    "LOE MOBIL 🔥";

  const options = {
    body:
      data.body ||
      "Tenemos novedades para ti.",

    icon:
      data.icon ||
      "/icon-192.PNG",

    badge:
      data.badge ||
      "/icon-192.PNG",

    data: {
      url:
        data.url ||
        "/"
    },

    tag:
      data.tag ||
      "loe-mobil",

    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});

/* ABRIR LA TIENDA AL TOCAR LA NOTIFICACIÓN */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const targetUrl =
      event.notification.data?.url ||
      "/";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(windowClients => {

          for (const client of windowClients) {

            if (
              "focus" in client &&
              new URL(client.url).origin === self.location.origin
            ) {

              if ("navigate" in client) {
                client.navigate(targetUrl);
              }

              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(targetUrl);
          }
        })
    );
  }
);
