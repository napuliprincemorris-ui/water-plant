self.addEventListener('install', event => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('message', event => {
  const data = event.data;
  if (data && data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification('Plant Watering Reminder', {
      body: data.text,
      icon: 'icon.png', // optional
      vibrate: [200, 100, 200],
      tag: 'plant-reminder'
    });
  }
});
notifyBtn.addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        alert('Notifications enabled!');
      } else {
        alert('Notifications denied.');
      }
    });
  } else {
    alert('This browser does not support notifications.');
  }
});
