if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}
function askNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }
}

function sendReminder(plantName) {
  if (Notification.permission === 'granted') {
    new Notification(`Time to water your ${plantName}!`);
  }
}

askNotificationPermission();

// Example usage:
// sendReminder('Aloe Vera');
