// service-worker.js

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Listen for messages from main script
self.addEventListener('message', event => {
  const data = event.data;
  if (data && data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification('Plant Watering Reminder', {
      body: data.text,
      icon: 'icon.png', // optional, provide your icon file
      vibrate: [200, 100, 200],
      tag: 'plant-reminder',
      renotify: true // ensures repeated notifications show
    });
  }
});
