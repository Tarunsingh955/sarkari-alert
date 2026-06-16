const CACHE = 'sarkari-v2'
const STATIC = ['/', '/jobs', '/current-affairs', '/resume', '/previous-papers', '/manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  if (e.request.url.includes('/api/')) return
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok && res.status < 400) caches.open(CACHE).then(c => c.put(e.request, res.clone()))
        return res
      }).catch(() => cached)
      return cached || fetched
    })
  )
})

self.addEventListener('push', e => {
  if (!e.data) return
  const data = e.data.json()
  e.waitUntil(self.registration.showNotification(data.title || 'SarkariAlert', {
    body: data.body, icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png', data: { url: data.url || '/' },
    actions: [{ action: 'open', title: 'Dekho' }, { action: 'close', title: 'Close' }]
  }))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'close') return
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'))
})
