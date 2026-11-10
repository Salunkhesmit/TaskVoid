document.addEventListener("DOMContentLoaded",()=>{
 const display=document.querySelector("[data-timer-display]");if(!display)return;
 const ring=document.querySelector("[data-timer-progress]");const modeButtons=document.querySelectorAll("[data-mode]");
 const durations={focus:25,short:5,long:15};let mode="focus",remaining=durations.focus*60,total=remaining,interval=null,running=false;
 const format=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
 function draw(){display.textContent=format(remaining);const circumference=2*Math.PI*115;ring.style.strokeDasharray=circumference;ring.style.strokeDashoffset=circumference*(1-remaining/total);document.querySelector("[data-timer-label]").textContent=mode==="focus"?"Focus session":mode==="short"?"Short break":"Long break";}
 function stop(){clearInterval(interval);interval=null;running=false;document.querySelector("[data-start]").innerHTML='<i class="fa-solid fa-play me-2"></i>Start';}
 function selectMode(next){stop();mode=next;remaining=durations[mode]*60;total=remaining;modeButtons.forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));draw();}
 document.querySelector("[data-start]").addEventListener("click",()=>{
  if(running){stop();return;}running=true;document.querySelector("[data-start]").innerHTML='<i class="fa-solid fa-pause me-2"></i>Pause';
  interval=setInterval(()=>{remaining--;draw();if(remaining<=0){stop();if(mode==="focus"){const sessions=TV_STORE.sessions();sessions.unshift({id:crypto.randomUUID(),date:new Date().toISOString(),minutes:durations.focus});TV_STORE.saveSessions(sessions);alert("Focus session complete. Take a break!");}else alert("Break complete. Ready for another session?");selectMode(mode==="focus"?"short":"focus");}},1000);
 });
 document.querySelector("[data-reset]").addEventListener("click",()=>{stop();remaining=total;draw();});
 modeButtons.forEach(b=>b.addEventListener("click",()=>selectMode(b.dataset.mode)));
 const custom=document.querySelector("#customMinutes");document.querySelector("[data-apply-custom]").addEventListener("click",()=>{const n=Math.max(1,Math.min(180,Number(custom.value)||25));durations.focus=n;selectMode("focus");});
 draw();
});
