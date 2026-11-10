document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector("[data-calendar-grid]");if(!grid)return;
 let shown=new Date();shown.setDate(1);
 const monthLabel=document.querySelector("[data-calendar-month]");
 const render=()=>{
  monthLabel.textContent=shown.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const year=shown.getFullYear(),month=shown.getMonth(),first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();
  const today=new Date().toISOString().slice(0,10);const tasks=TV_STORE.tasks();
  grid.innerHTML="";
  ["SUN","MON","TUE","WED","THU","FRI","SAT"].forEach(d=>grid.insertAdjacentHTML("beforeend",`<div class="calendar-head">${d}</div>`));
  for(let i=0;i<first;i++)grid.insertAdjacentHTML("beforeend",`<div class="calendar-day"></div>`);
  for(let d=1;d<=days;d++){const date=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const count=tasks.filter(t=>t.due===date&&!t.completed).length;
   grid.insertAdjacentHTML("beforeend",`<div class="calendar-day ${date===today?"today":""}"><div class="day-num">${d}</div>${count?`<div class="mt-2"><span class="calendar-dot"></span><span style="font-size:9px">${count} task${count>1?"s":""}</span></div>`:""}</div>`);
  }
 };
 document.querySelector("[data-prev-month]").addEventListener("click",()=>{shown.setMonth(shown.getMonth()-1);render();});
 document.querySelector("[data-next-month]").addEventListener("click",()=>{shown.setMonth(shown.getMonth()+1);render();});
 render();
});
