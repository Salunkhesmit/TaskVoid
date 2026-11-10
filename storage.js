const TV_STORE = {
  get(key, fallback = null) {
    try { const raw = localStorage.getItem(`taskvoid_${key}`); return raw === null ? fallback : JSON.parse(raw); }
    catch (e) { console.warn("TASKVOID storage read failed", e); return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`taskvoid_${key}`, JSON.stringify(value)); return true; }
    catch (e) { console.warn("TASKVOID storage write failed", e); return false; }
  },
  remove(key) { localStorage.removeItem(`taskvoid_${key}`); },
  tasks() { return this.get("tasks", []); },
  saveTasks(tasks) { this.set("tasks", tasks); },
  sessions() { return this.get("sessions", []); },
  saveSessions(sessions) { this.set("sessions", sessions); }
};
