TV_STORE.get("theme", "dark") === "light"
  ? document.documentElement.setAttribute("data-theme", "light")
  : document.documentElement.removeAttribute("data-theme");

document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.querySelector("[data-current-date]");
  if (dateEl) dateEl.textContent = new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"}).format(new Date());
  document.querySelectorAll("[data-mobile-menu]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
  }));
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href.endsWith(path)) link.classList.add("active");
  });
});
function taskStats(){
  const tasks = TV_STORE.tasks();
  const done = tasks.filter(t=>t.completed).length;
  return {total:tasks.length,done,pending:tasks.length-done,percent:tasks.length?Math.round(done/tasks.length*100):0};
}
function todayTasks(){
  const today = new Date().toISOString().slice(0,10);
  return TV_STORE.tasks().filter(t=>t.due===today);
}
