document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("[data-task-list]")) return;
  let filter = "all";
  const list = document.querySelector("[data-task-list]");
  const form = document.querySelector("#taskForm");
  const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector("#taskModal"));
  const taskId = document.querySelector("#taskId");
  const title = document.querySelector("#taskTitle");
  const category = document.querySelector("#taskCategory");
  const priority = document.querySelector("#taskPriority");
  const due = document.querySelector("#taskDue");
  const search = document.querySelector("#taskSearch");
  const render = () => {
    const tasks = TV_STORE.tasks();
    const query = (search?.value || "").toLowerCase().trim();
    const visible = tasks.filter(t => (filter==="all" || (filter==="pending"&&!t.completed) || (filter==="completed"&&t.completed)) &&
      `${t.title} ${t.category}`.toLowerCase().includes(query));
    if (!visible.length) { list.innerHTML = `<div class="empty-state"><i class="fa-regular fa-clipboard d-block"></i>No tasks here yet. Add a task to get started.</div>`; }
    else list.innerHTML = visible.map(t => `
      <div class="task-row fade-in">
        <input class="task-check" type="checkbox" data-complete="${t.id}" ${t.completed?"checked":""} aria-label="Mark task complete">
        <div class="task-main"><div class="task-title ${t.completed?"done":""}">${escapeHTML(t.title)}</div>
          <div class="task-meta">${escapeHTML(t.category||"General")} ${t.due?`· Due ${escapeHTML(t.due)}`:"· No deadline"}</div></div>
        <span class="priority priority-${t.priority}">${t.priority.toUpperCase()}</span>
        <button class="icon-button" data-edit="${t.id}" aria-label="Edit task"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-button" data-delete="${t.id}" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
      </div>`).join("");
    document.querySelector("[data-task-count]").textContent = `${tasks.length} tasks`;
  };
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
    filter=btn.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===btn));render();
  }));
  search?.addEventListener("input",render);
  list.addEventListener("click",e=>{
    const target=e.target.closest("[data-delete],[data-edit]");if(!target)return;
    let tasks=TV_STORE.tasks();const id=target.dataset.delete||target.dataset.edit;const task=tasks.find(t=>t.id===id);
    if(target.dataset.delete){TV_STORE.saveTasks(tasks.filter(t=>t.id!==id));render();}
    else if(task){taskId.value=task.id;title.value=task.title;category.value=task.category;priority.value=task.priority;due.value=task.due||"";document.querySelector("#taskModalTitle").textContent="Edit task";modal.show();}
  });
  list.addEventListener("change",e=>{
    const id=e.target.dataset.complete;if(!id)return;
    const tasks=TV_STORE.tasks();const task=tasks.find(t=>t.id===id);if(task){task.completed=e.target.checked;task.completedAt=task.completed?new Date().toISOString():null;TV_STORE.saveTasks(tasks);render();}
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();const tasks=TV_STORE.tasks();const existing=tasks.find(t=>t.id===taskId.value);
    const record={id:taskId.value||crypto.randomUUID(),title:title.value.trim(),category:category.value,priority:priority.value,due:due.value,completed:existing?.completed||false,createdAt:existing?.createdAt||new Date().toISOString()};
    if(existing)Object.assign(existing,record);else tasks.unshift(record);
    TV_STORE.saveTasks(tasks);form.reset();taskId.value="";document.querySelector("#taskModalTitle").textContent="Add task";modal.hide();render();
  });
  document.querySelectorAll("[data-open-task-modal]").forEach(btn=>btn.addEventListener("click",()=>{form.reset();taskId.value="";document.querySelector("#taskModalTitle").textContent="Add task";modal.show();}));
  render();
});
