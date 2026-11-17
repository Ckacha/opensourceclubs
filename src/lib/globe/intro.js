const DURATION = { full: 4.6, short: 3.2 };
const MAX_STEP = 1 / 20;

export const FADE_MS = 900;

const MOON_DIST = 3.4; 
const MOON_SIZE = 0.27; 
const ORBIT_TILT = 0.22;
const START_ANGLE = 75; 
const SWEEP = 230; 
const START_SIZE = 0.11; 
const FADE_IN = 0.6; 
const STAR_COUNTS = [110, 180, 260];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const easeInOutSine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
const lerp = (a, b, k) => a + (b - a) * k;

export function measureGlobeRadius(map) {
  try {
    if (map.getProjection()?.type !== "globe") throw new Error("not a globe yet");
    const c = map.getCenter();
    const center = map.project(c);
    const lat1 = (c.lat * Math.PI) / 180;
    const lng1 = (c.lng * Math.PI) / 180;
    let best = 0;
    for (let deg = 1; deg <= 90; deg += 1) {
      const d = (deg * Math.PI) / 180;
      const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d));
      const lng2 = lng1 + Math.atan2(Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
      const p = map.project([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
      best = Math.max(best, Math.hypot(p.x - center.x, p.y - center.y));
    }
    if (best > 10) return best;
  } catch {
  }
  return (0.951 * 512 * Math.pow(2, map.getZoom())) / (2 * Math.PI);
}

function pickTier() {
  const forced = parseInt(new URLSearchParams(location.search).get("introTier"), 10);
  if (forced >= 0 && forced < STAR_COUNTS.length) return forced;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (saveData || cores <= 2 || mem <= 2) return 0;
  if (matchMedia("(pointer: coarse)").matches || cores <= 4 || mem <= 4) return 1;
  return 2;
}

function makeSky(count) {
  const groups = [[], [], [], []];
  for (let i = 0; i < count; i++) {
    groups[i % 4].push({ x: Math.random(), y: Math.random(), size: 0.4 + Math.random() * 1.1 });
  }
  return groups;
}

export function createIntro({ stage, canvas, map, moon, variant = "full", onDone = () => {} }) {
  const duration = DURATION[variant] || DURATION.full;
  const mapEl = map.getContainer();
  const ctx = canvas.getContext("2d", { alpha: false });
  const end = map.getCenter();
  const frozenT = parseFloat(new URLSearchParams(location.search).get("introT"));
  const frozen = Number.isFinite(frozenT);
  const tier = pickTier();
  const sky = makeSky(STAR_COUNTS[tier]);

  let W, H, dpr, R, r0, mcx, mcy, startX, startY;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const s = stage.getBoundingClientRect();
    const m = mapEl.getBoundingClientRect();
    mcx = m.left - s.left + m.width / 2;
    mcy = m.top - s.top + m.height / 2;

    R = measureGlobeRadius(map); 
    r0 = START_SIZE * Math.min(W, H); 

    const a0 = (START_ANGLE * Math.PI) / 180;
    startX = W / 2 - (MOON_DIST * r0 * Math.sin(a0)) / 2;
    startY = H / 2 - (MOON_DIST * r0 * ORBIT_TILT * Math.cos(a0)) / 2;
  };
  resize();
  window.addEventListener("resize", resize);

  mapEl.style.willChange = "transform, opacity";
  mapEl.style.opacity = "0";

  let t = 0;
  let lastNow = null;
  let slowFrames = 0;
  let done = false;
  let rafId;

  function frame(now) {
    if (lastNow !== null) {
      const dtMs = now - lastNow;
      slowFrames = dtMs > 90 ? slowFrames + 1 : 0;
      if (slowFrames > 20 && !frozen) return finish();
      t += Math.min(dtMs / 1000, MAX_STEP);
    }
    lastNow = now;
    if (done) return;
    if (frozen) t = frozenT;
    window.__introStats = { variant, tier, t: +t.toFixed(2) };

    const u = clamp01(t / duration);
    const zoomK = smooth(u); 
    const theta = SWEEP * easeInOutSine(u); 
    const r = r0 * Math.exp(Math.log(R / r0) * zoomK);
    const ex = lerp(startX, mcx, zoomK);
    const ey = lerp(startY, mcy, zoomK);
    const fadeIn = smooth(t / FADE_IN);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0d0d14";
    ctx.fillRect(0, 0, W, H);

    const drift = theta * (W / 360) * 0.5;
    ctx.fillStyle = "#ffffff";
    for (let g = 0; g < 4; g++) {
      ctx.globalAlpha = fadeIn * (0.35 + 0.3 * Math.sin(t * 1.6 + g * 1.57));
      for (const st of sky[g]) {
        const x = (((st.x * W + drift) % W) + W) % W;
        ctx.fillRect(x, st.y * H, st.size, st.size);
      }
    }

    map.jumpTo({ center: [end.lng + (SWEEP - theta), end.lat] });
    mapEl.style.opacity = fadeIn;
    mapEl.style.transform = `translate3d(${ex - mcx}px, ${ey - mcy}px, 0) scale(${r / R})`;

    if (moon) {
      const a = ((START_ANGLE - theta) * Math.PI) / 180;
      const front = Math.cos(a);
      const mx = ex + MOON_DIST * r * Math.sin(a);
      const my = ey + MOON_DIST * r * ORBIT_TILT * front;
      const mr = MOON_SIZE * r * (1 + 0.18 * front); 
      moon.style.transform = `translate3d(${mx - 50}px, ${my - 50}px, 0) scale(${mr / 50})`;
      moon.style.zIndex = front > 0 ? "2" : "0";
      moon.style.opacity = fadeIn * (1 - smooth((u - 0.7) / 0.25));
    }

    if (t >= duration && !frozen) return finish();
    rafId = requestAnimationFrame(frame);
  }

  function cleanup() {
    if (done) return;
    done = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    map.jumpTo({ center: end });
    mapEl.style.transform = "";
    mapEl.style.opacity = "";
    mapEl.style.willChange = "";
  }

  function finish() {
    if (done) return;
    cleanup();
    onDone();
  }

  rafId = requestAnimationFrame(frame);
  return { skip: finish, destroy: cleanup };
}
