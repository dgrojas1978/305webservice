/* ============================================================
   Timeline determinista para reels — sistema «Monumento 305».
   Cada reel define window.REEL = { total, bgs, tracks, subs }
   y llama initReel(). El renderer invoca window.seek(ms).
   Animación editorial: máscaras, líneas, desplazamientos.
   Easing cubic-bezier suave. Sin rebotes ni efectos 3D.
   ============================================================ */

function cubicBezier(p1x, p1y, p2x, p2y) {
  // solver estándar (Newton-Raphson + bisección)
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const sampleX = t => ((ax * t + bx) * t + cx) * t;
  const sampleY = t => ((ay * t + by) * t + cy) * t;
  const sampleDX = t => (3 * ax * t + 2 * bx) * t + cx;
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const d = sampleDX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    t = Math.max(0, Math.min(1, t));
    return sampleY(t);
  };
}

const EASE = cubicBezier(0.22, 0.61, 0.36, 1);      // salida suave
const EASE_IN_OUT = cubicBezier(0.65, 0, 0.35, 1);  // desplazamientos

const clamp01 = v => Math.max(0, Math.min(1, v));

function applyTrack(el, tr, t) {
  const dur = tr.dur ?? 350;
  const exitDur = tr.exitDur ?? 300;
  const hasExit = tr.exit === "fade";
  const visible = t >= tr.in && t < tr.out;
  if (!visible) { el.style.visibility = "hidden"; return; }
  el.style.visibility = "visible";

  const p = clamp01((t - tr.in) / dur);
  let alpha = 1;
  if (hasExit) alpha = 1 - EASE(clamp01((t - (tr.out - exitDur)) / exitDur));

  switch (tr.enter) {
    case "lines": {
      // cada .li se revela desde abajo dentro de su máscara .ln
      const lines = el.querySelectorAll(".li");
      const stagger = tr.stagger ?? 80;
      lines.forEach((li, i) => {
        const pi = EASE(clamp01((t - tr.in - i * stagger) / dur));
        li.style.transform = `translateY(${(1 - pi) * 112}%)`;
      });
      el.style.opacity = alpha;
      break;
    }
    case "maskx": {
      // el interior entra deslizándose dentro de una máscara
      const inner = el.querySelector(".mask-inner");
      const e = EASE_IN_OUT(p);
      if (inner) inner.style.transform = `translateX(${(1 - e) * 55}%)`;
      el.style.opacity = alpha;
      break;
    }
    case "rule": {
      el.style.transform = `scaleX(${EASE(p)})`;
      el.style.transformOrigin = "left center";
      el.style.opacity = alpha;
      break;
    }
    case "fade": {
      const e = EASE(p);
      el.style.opacity = Math.min(e, alpha);
      el.style.transform = `translateY(${(1 - e) * 26}px)`;
      break;
    }
    case "static":
    default:
      el.style.opacity = alpha;
  }
}

function initReel() {
  const R = window.REEL;
  R._els = R.tracks.map(tr => document.getElementById(tr.id));
  R._sub = document.getElementById("sub");
  R._canvas = document.getElementById("canvas");
  window.seek = function (t) {
    // fondo por tramo
    let bg = R.bgs[0];
    for (const b of R.bgs) if (t >= b.t0) bg = b;
    R._canvas.dataset.theme = bg.theme;

    R.tracks.forEach((tr, i) => applyTrack(R._els[i], tr, t));

    // subtítulos incorporados (narración)
    let sub = null;
    for (const s of R.subs) if (t >= s.t0 && t < s.t1) sub = s;
    if (sub) {
      R._sub.textContent = sub.text;
      R._sub.style.visibility = "visible";
    } else {
      R._sub.style.visibility = "hidden";
    }
    return true;
  };
  window.TOTAL_MS = R.total;
  window.seek(0);
}
