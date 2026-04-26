/* eslint-disable no-restricted-globals */
/* global self, clients */

// Custom service worker code that next-pwa concatenates with the
// generated workbox SW (configured via next.config.js).

// --- Click handler: focus existing tab or open root ----------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      for (const client of allClients) {
        // If there's already a tab open, focus it
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            try {
              await client.navigate(targetUrl);
            } catch (_) {
              /* navigation may be blocked – ignore */
            }
          }
          return;
        }
      }
      if (clients.openWindow) {
        await clients.openWindow(targetUrl);
      }
    })()
  );
});

// --- Periodic Background Sync (Chromium/Edge, best-effort) ---------------
// The page registers the 'omer-daily-reminder' tag. The browser decides
// the cadence (we asked for 12h). When it fires we open the app to let the
// page check whether 21:00 has passed today and show the notification.
self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'omer-daily-reminder') return;
  event.waitUntil(
    (async () => {
      // Wake any open client so its NotificationManager can re-evaluate.
      const allClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      for (const client of allClients) {
        client.postMessage({ type: 'omer-check' });
      }
    })()
  );
});
