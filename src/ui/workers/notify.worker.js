self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)
  console.log('data ', event)

  const title = 'Notifry'
  const options = {
    body: event.data.text(),
    badge: 'badge.png',
    icon: 'badge.png',
    image: 'badge-ball.jpg',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
