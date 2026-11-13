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

/* Subtle 3D Background */
(function () {
  if (window.__tvBg) return;
  window.__tvBg = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  s.onload = start;
  document.head.appendChild(s);

  function start() {
    if (!window.THREE) return;
    const canvas = document.createElement("canvas");
    canvas.className = "void-bg";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    const pivot = new THREE.Group();
    const group = new THREE.Group();
    pivot.add(group);
    scene.add(pivot);

    const outerMat = new THREE.LineBasicMaterial({ transparent: true });
    const innerMat = new THREE.LineBasicMaterial({ transparent: true });
    const outer = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.6, 1)), outerMat);
    const inner = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.4, 0)), innerMat);
    group.add(outer, inner);

    const N = window.innerWidth < 760 ? 40 : 90;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.random() * 4, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.04, transparent: true });
    group.add(new THREE.Points(pGeo, pMat));

    function paint() {
      const root = document.documentElement;
      const light = root.getAttribute("data-theme") === "light";
      const c = getComputedStyle(root).getPropertyValue("--accent").trim() || "#a78bfa";
      outerMat.color.set(c); innerMat.color.set(c); pMat.color.set(c);
      outerMat.opacity = light ? 0.28 : 0.2;
      innerMat.opacity = light ? 0.2 : 0.14;
      pMat.opacity = light ? 0.45 : 0.4;
      if (reduce) renderer.render(scene, camera);
    }

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pivot.position.x = camera.aspect > 1.3 ? 3.8 : 0;
      if (reduce) renderer.render(scene, camera);
    }

    let mx = 0, my = 0, cx = 0, cy = 0;
    if (!reduce && window.innerWidth >= 760) {
      window.addEventListener("pointermove", e => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }

    function tick() {
      if (!document.hidden) {
        group.rotation.y += 0.0016;
        group.rotation.x += 0.0007;
        cx += (mx - cx) * 0.04;
        cy += (my - cy) * 0.04;
        pivot.rotation.y = cx * 0.35;
        pivot.rotation.x = cy * 0.2;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    paint();
    resize();
    if (!reduce) tick();
  }
})();
