document.addEventListener("DOMContentLoaded",()=>{
 const target=document.querySelector("[data-analytics]");if(!target)return;
 const tasks=TV_STORE.tasks(),sessions=TV_STORE.sessions(),done=tasks.filter(t=>t.completed).length;
 document.querySelector("[data-analytics-total]").textContent=tasks.length;
 document.querySelector("[data-analytics-done]").textContent=done;
 document.querySelector("[data-analytics-pending]").textContent=tasks.length-done;
 document.querySelector("[data-analytics-sessions]").textContent=sessions.length;
 const mins=sessions.reduce((sum,s)=>sum+(Number(s.minutes)||0),0);document.querySelector("[data-analytics-minutes]").textContent=mins;
 const ctx=document.querySelector("#productivityChart");
 if(ctx&&window.Chart){const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));}
  const values=days.map(day=>sessions.filter(s=>s.date.slice(0,10)===day).reduce((sum,s)=>sum+s.minutes,0));
  new Chart(ctx,{type:"bar",data:{labels:days.map(d=>new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"short"})),datasets:[{label:"Focus minutes",data:values,backgroundColor:"rgba(139,92,246,.7)",borderColor:"#8b5cf6",borderRadius:7}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:"#8d96ad"}},y:{beginAtZero:true,grid:{color:"#252b3b"},ticks:{color:"#8d96ad"}}}}});
 }
});
