TV_STORE.get("theme", "dark") === "light"
  ? document.documentElement.setAttribute("data-theme", "light")
  : document.documentElement.removeAttribute("data-theme");

document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.querySelector("[data-current-date]");
  if (dateEl) dateEl.textContent = new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"}).format(new Date());
  document.querySelectorAll("[data-mobile-menu]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
  }));
    const bar = document.querySelector(".topbar");
  const chip = document.querySelector(".date-chip");
  if (bar) {
    const right = document.createElement("div");
    right.className = "topbar-right";
    const btn = document.createElement("button");
    btn.className = "icon-button";
    btn.type = "button";
    const paint = () => {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      btn.innerHTML = `<i class="fa-solid ${light ? "fa-moon" : "fa-sun"}"></i>`;
      const label = light ? "Switch to dark mode" : "Switch to light mode";
      btn.setAttribute("aria-label", label);
      btn.title = label;
    };
    btn.addEventListener("click", () => {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      if (light) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "light");
      TV_STORE.set("theme", light ? "dark" : "light");
      paint();
    });
    if (chip) { chip.replaceWith(right); right.appendChild(chip); } else bar.appendChild(right);
    right.appendChild(btn);
    paint();
  }
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
