(() => {

  const dateDisplay = document.getElementById("dateDisplay");
  const clock = document.getElementById("clock");

  const addBtn = document.getElementById("addBtn");
  const notifyBtn = document.getElementById("notifyBtn");
  const clearAllBtn = document.getElementById("clearAll");

  const reminderText = document.getElementById("reminderText");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const mlSelect = document.getElementById("ml");

  const reminderList = document.getElementById("reminderList");
  const totalPointsEl = document.getElementById("totalPoints");
  const streakText = document.getElementById("streakText");
  const rewardsBtn = document.getElementById("viewRewardsLog");

  const ding = document.getElementById("dingSound");

  let reminders = JSON.parse(localStorage.getItem("rem")) || [];
  let state = JSON.parse(localStorage.getItem("state")) || {
    points: 0,
    streak: 0,
    lastCompleteDate: null,
    notifications: false,
    sound: true
  };

  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  function save(){
    localStorage.setItem("rem", JSON.stringify(reminders));
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("logs", JSON.stringify(logs));
  }

  function pad(n){ return String(n).padStart(2,"0"); }

  function updateClock(){
    const now = new Date();
    dateDisplay.textContent = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
    clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  function render(){
    reminderList.innerHTML = "";

    if(reminders.length === 0){
      reminderList.innerHTML = `<div style="color:#777">No reminders yet</div>`;
      return;
    }

    reminders.forEach(r => {
      const div = document.createElement("div");
      div.className = "reminder";

      const t = document.createElement("div");
      t.className = "text";
      t.textContent = r.text;

      const actions = document.createElement("div");
      actions.className = "actions";

      const complete = document.createElement("button");
      complete.className = "complete";
      complete.textContent = "Complete";
      complete.onclick = () => completeReminder(r.id);

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "Delete";
      del.onclick = () => deleteReminder(r.id);

      actions.appendChild(complete);
      actions.appendChild(del);

      div.appendChild(t);
      div.appendChild(actions);
      reminderList.appendChild(div);
    });
  }

  function addReminder(){
    const text = reminderText.value.trim();
    if(!text){
      alert("Please enter a reminder.");
      return;
    }

    reminders.push({
      id: Date.now(),
      text,
      date: dateInput.value,
      time: timeInput.value,
      ml: mlSelect.value,
    });

    reminderText.value = "";
    dateInput.value = "";
    timeInput.value = "";

    save();
    render();
  }

  function deleteReminder(id){
    reminders = reminders.filter(r => r.id !== id);
    save();
    render();
  }

  function completeReminder(id){
    const r = reminders.find(x => x.id === id);
    if(!r) return;

    // points
    state.points += 10;

    // streak
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    if(state.lastCompleteDate === key){
      // same day
    } else {
      if(state.lastCompleteDate){
        const [y,m,d] = state.lastCompleteDate.split("-").map(Number);
        const last = new Date(y, m-1, d);
        const diff = (today - last)/(1000*60*60*24);
        state.streak = diff === 1 ? state.streak + 1 : 1;
      } else {
        state.streak = 1;
      }
      state.lastCompleteDate = key;
    }

    // log
    logs.unshift({
      id: "l" + Date.now(),
      text: r.text,
      pts: 10,
      date: new Date().toISOString()
    });

    // sound + notification
    if(state.sound) ding.play().catch(()=>{});
    if(state.notifications && Notification.permission === "granted"){
      new Notification("Completed!", { body: r.text + " (+10 pts)" });
    }

    reminders = reminders.filter(x => x.id !== id);
    save();
    updateUI();
    render();
  }

  function updateUI(){
    totalPointsEl.textContent = state.points;
    streakText.textContent = state.streak > 0 ? `Streak: ${state.streak} days` : "No streaks yet";

    notifyBtn.textContent = state.notifications ? "Notifications Enabled" : "Enable Notifications & Sound";
  }

  async function toggleNotify(){
    if(Notification.permission === "default"){
      await Notification.requestPermission();
    }
    state.notifications = Notification.permission === "granted";
    save();
    updateUI();
  }

  function clearAll(){
    if(!confirm("Clear all reminders?")) return;
    reminders = [];
    save();
    render();
  }

  function viewLogs(){
    if(logs.length === 0){
      alert("No reward history yet.");
      return;
    }
    alert(logs.map(l => `${new Date(l.date).toLocaleString()}: ${l.text} (+${l.pts})`).join("\n"));
  }

  addBtn.onclick = addReminder;
  notifyBtn.onclick = toggleNotify;
  clearAllBtn.onclick = clearAll;
  rewardsBtn.onclick = viewLogs;

  updateUI();
  render();

})();
