// Elements
const reminderList = document.getElementById('reminderList');
const addBtn = document.getElementById('addBtn');
const notifyBtn = document.getElementById('notifyBtn');
const dingSound = document.getElementById('dingSound');

const treeSelect = document.getElementById('treeName');
const mlSelect = document.getElementById('ml');
const freqSelect = document.getElementById('frequency');
const daySelect = document.getElementById('dayOfWeek');
const timeSelect = document.getElementById('time');

// Load reminders from localStorage
let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');

// Render reminders in the list
function renderReminders() {
  reminderList.innerHTML = '';
  reminders.forEach(r => {
    const div = document.createElement('div');
    div.className = 'reminder-item';
    div.textContent = `${r.tree}: ${r.ml} ml, ${r.frequency}, on ${r.day} at ${r.time}`;
    reminderList.appendChild(div);
  });
}
renderReminders();

// Add new reminder
addBtn.addEventListener('click', () => {
  const tree = treeSelect.value;
  const ml = mlSelect.value;
  const frequency = freqSelect.value;
  const day = daySelect.value;
  const time = timeSelect.value;

  if (!tree || !ml || !frequency || !day || !time) {
    return alert('Fill all fields!');
  }

  reminders.push({ tree, ml, frequency, day, time, done: false });
  localStorage.setItem('reminders', JSON.stringify(reminders));
  renderReminders();
});

// Request notification permission
notifyBtn.addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') alert('Notifications enabled!');
      else alert('Notifications blocked.');
    });
  } else {
    alert('Browser does not support notifications.');
  }
});

// Check reminders every second
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

  reminders.forEach(r => {
    if (r.time === currentTime && r.day === currentDay && !r.done) {
      alert(`Reminder: ${r.tree}`);
      dingSound.play();

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          text: `${r.tree}: ${r.ml} ml`
        });
      }

      r.done = true;
    }
  });

  localStorage.setItem('reminders', JSON.stringify(reminders));
}, 1000);

// Optional: clear all reminders
document.getElementById('clearAll')?.addEventListener('click', () => {
  reminders = [];
  localStorage.setItem('reminders', JSON.stringify(reminders));
  renderReminders();
});
