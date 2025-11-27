const reminderList = document.getElementById('reminderList');
const addBtn = document.getElementById('addBtn');
const notifyBtn = document.getElementById('notifyBtn');
const dingSound = document.getElementById('dingSound');

let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

// Show reminders in list
function renderReminders() {
  reminderList.innerHTML = '';
  reminders.forEach(r => {
    const div = document.createElement('div');
    div.className = 'reminder-item';
    div.textContent = `${r.text} at ${r.date} ${r.time} (${r.ml} ml)`;
    reminderList.appendChild(div);
  });
}
renderReminders();

// Add new reminder
addBtn.addEventListener('click', () => {
  const text = document.getElementById('reminderText').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const ml = document.getElementById('ml').value;

  if (!text || !date || !time) return alert('Fill all fields!');
  reminders.push({ text, date, time, ml, done: false });
  localStorage.setItem('reminders', JSON.stringify(reminders));
  renderReminders();
});

// Request notifications
notifyBtn.addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') alert('Notifications enabled!');
    });
  }
});

// Check reminders every second
setInterval(() => {
  const now = new Date();
  const currentDate = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);

  reminders.forEach(r => {
    if (r.date === currentDate && r.time === currentTime && !r.done) {
      // Play sound
      dingSound.play();

      // Popup alert
      alert(`Reminder: ${r.text}`);

      // Send notification to service worker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          text: r.text
        });
      }

      r.done = true; // mark as done
    }
  });

  localStorage.setItem('reminders', JSON.stringify(reminders));
}, 1000);
