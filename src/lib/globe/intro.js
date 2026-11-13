import { brand } from "./mapStyle.js";

const GAL_R = 50000;
const SUN_R = 1.6;
const SOLAR_R = 64;
const EARTH = { orbit: 11, r: 0.35 };
const PLANETS = [
  { orbit: 5, r: 0.2, color: brand.muted },
  { orbit: 8, r: 0.3, color: brand.orange },
  EARTH,
  { orbit: 15, r: 0.25, color: brand.red },
  { orbit: 25, r: 0.9, color: "#f5b971" },
  { orbit: 35, r: 0.75, color: brand.yellow, ring: true },
  { orbit: 47, r: 0.5, color: brand.cyan },
  { orbit: 58, r: 0.5, color: brand.blue },
];

const TIMELINES = {
  full: { hold: 0.8, solar: 3.4, solarHold: 4.6, earth: 6.8 },
  short: { hold: 0.3, solar: 1.5, solarHold: 2.1, earth: 3.4 },
};
export const FADE_MS = 900;
const MAX_STEP = 1 / 20;

const TIERS = [
  { stride: 3, dpr: 1, sky: 110 },
  { stride: 2, dpr: 1.5, sky: 180 },
  { stride: 1, dpr: 2, sky: 260 },
];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function measureGlobeRadius(map) {
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

function spline(xs, ys) {
  const n = xs.length;
  const d = [];
  const m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const tau = 3 / Math.sqrt(h);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

function pickTier() {
  const forced = parseInt(new URLSearchParams(location.search).get("introTier"), 10);
  if (forced >= 0 && forced < TIERS.length) return forced;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (saveData || cores <= 2 || mem <= 2) return 0;
  if (coarse || cores <= 4 || mem <= 4) return 1;
  return 2;
}

function makeGalaxy() {
  const ARMS = 4;
  const sun = { r: GAL_R * 0.55 };
  sun.ang = (1 * Math.PI * 2) / ARMS + Math.log(sun.r / 1000) * 1.6;
  sun.x = sun.r * Math.cos(sun.ang);
  sun.y = sun.r * Math.sin(sun.ang);

  const groups = new Map();
  const add = (x, y, color, size, alpha) => {
    const a = alpha < 0.5 ? 0.4 : alpha < 0.75 ? 0.65 : 0.9;
    const key = color + a;
    if (!groups.has(key)) groups.set(key, { color, alpha: a, xs: [], ys: [], sizes: [] });
    const g = groups.get(key);
    g.xs.push(x);
    g.ys.push(y);
    g.sizes.push(size);
  };

  for (let i = 0; i < 9000; i++) {
    let r, ang, color;
    if (i < 2200) {
      r = Math.abs(gauss()) * GAL_R * 0.16;
      ang = Math.random() * Math.PI * 2;
      color = [brand.yellow, brand.orange, "#fff3d6", "#ffffff"][i % 4];
    } else {
      const arm = i % ARMS;
      r = GAL_R * (0.08 + 0.92 * Math.pow(Math.random(), 0.9));
      ang = (arm * Math.PI * 2) / ARMS + Math.log(r / 1000) * 1.6 + gauss() * 0.32;
      const roll = Math.random();
      color =
        roll < 0.68 ? "#e6ecf7" : roll < 0.83 ? brand.cyan : roll < 0.93 ? brand.purple : roll < 0.98 ? brand.red : brand.yellow;
    }
    const x = r * Math.cos(ang);
    const y = r * Math.sin(ang);
    if ((x - sun.x) ** 2 + (y - sun.y) ** 2 < 300 * 300) continue;
    add(x, y, color, 0.6 + Math.random() * 1.2, 0.35 + Math.random() * 0.6);
  }

  for (let i = 0; i < 1400; i++) {
    const d = 300 + Math.pow(Math.random(), 1.5) * 4000;
    const a = Math.random() * Math.PI * 2;
    add(
      sun.x + d * Math.cos(a),
      sun.y + d * Math.sin(a),
      Math.random() < 0.8 ? "#e6ecf7" : brand.cyan,
      0.5 + Math.random() * 0.9,
      0.3 + Math.random() * 0.5,
    );
  }
  return { groups: [...groups.values()], sun };
}

function makeSky(count) {
  const phases = [[], [], [], []];
  for (let i = 0; i < count; i++) {
    phases[i % 4].push({ x: Math.random(), y: Math.random(), size: 0.4 + Math.random() * 1.1 });
  }
  return phases;
}

export function createIntro({ stage, canvas, map, variant = "full", onCaption = () => {}, onDone = () => {} }) {
  const T = TIMELINES[variant] || TIMELINES.full;
  const mapEl = map.getContainer();
  const ctx = canvas.getContext("2d", { alpha: false });

  const galaxy = makeGalaxy();
  const earthAngle0 = -2.2;
  const params = new URLSearchParams(location.search);
  const frozenT = parseFloat(params.get("introT"));
  const frozen = Number.isFinite(frozenT);

  let tier = pickTier();
  let sky = makeSky(TIERS[tier].sky);
  let W, H, dpr, R, L0, L1, L1b, L2, zoomCurve;
  let mcx, mcy;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, TIERS[tier].dpr);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const s = stage.getBoundingClientRect();
    const m = mapEl.getBoundingClientRect();

    mcx = mapEl.offsetLeft + mapEl.offsetWidth / 2;
    mcy = mapEl.offsetTop + mapEl.offsetHeight / 2;
    if (!mapEl.offsetParent || mapEl.offsetParent !== stage) {
      mcx = m.left - s.left + m.width / 2;
      mcy = m.top - s.top + m.height / 2;
    }
    R = measureGlobeRadius(map);

    const fit = Math.min(W, H);
    L0 = Math.log((0.46 * fit) / GAL_R);
    L1 = Math.log((0.44 * fit) / SOLAR_R);
    L1b = L1 + Math.log(1.7);
    L2 = Math.log(R / EARTH.r);
    zoomCurve = spline([0, T.hold, T.solar, T.solarHold, T.earth], [L0, L0 + 0.15, L1, L1b, L2]);
  };
  resize();
  window.addEventListener("resize", resize);

  mapEl.style.willChange = "transform, opacity";
  mapEl.style.opacity = "0";

  let lastNow = null;
  let frameEma = 16.7;
  let frameCount = 0;
  let cooldown = 0;
  let slowStreak = 0;
  function adapt(dtMs) {
    frameCount++;
    if (frameCount < 6) return;
    frameEma = frameEma * 0.9 + dtMs * 0.1;
    if (cooldown > 0) return cooldown--;
    if (frameEma > 24 && tier > 0) {
      tier--;
      sky = makeSky(TIERS[tier].sky);
      resize();
      cooldown = 20;
      frameEma = 16.7;
    } else if (tier === 0 && frameEma > 60 && !frozen) {
      if (++slowStreak > 20) finish();
    } else {
      slowStreak = 0;
    }
  }

  let t = 0;
  let done = false;
  let rafId;
  let label = "";

  function frame(now) {
    if (lastNow !== null) {
      const dtMs = now - lastNow;
      adapt(dtMs);
      t += Math.min(dtMs / 1000, MAX_STEP);
    }
    lastNow = now;
    if (done) return;
    if (frozen) t = frozenT;
    window.__introStats = { variant, tier, frameMs: +frameEma.toFixed(1), t: +t.toFixed(2) };

    const { stride } = TIERS[tier];
    const L = zoomCurve(t);
    const s = Math.exp(L);

    const rot = t * 0.035;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);
    const S = { x: galaxy.sun.x * cosR - galaxy.sun.y * sinR, y: galaxy.sun.x * sinR + galaxy.sun.y * cosR };
    const earthAng = earthAngle0 + t * 0.12;
    const E = { x: S.x + EARTH.orbit * Math.cos(earthAng), y: S.y + EARTH.orbit * Math.sin(earthAng) };

    let c;
    let k3 = 0;
    if (L < L1) {
      const w = (Math.exp(L0) / s) * (1 - smooth((L - L0) / (L1 - L0)));
      c = { x: S.x * (1 - w), y: S.y * (1 - w) };
    } else if (L < L1b) {
      c = S;
    } else {
      k3 = smooth((L - L1b) / (L2 - L1b));
      const w = (Math.exp(L1b) / s) * (1 - k3);
      c = { x: E.x + (S.x - E.x) * w, y: E.y + (S.y - E.y) * w };
    }
    const ax = W / 2 + (mcx - W / 2) * k3;
    const ay = H / 2 + (mcy - H / 2) * k3;
    const toScreen = (x, y) => [(x - c.x) * s + ax, (y - c.y) * s + ay];

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0d0d14";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff";
    for (let p = 0; p < 4; p++) {
      ctx.globalAlpha = 0.35 + 0.3 * Math.sin(t * 1.6 + p * 1.57);
      for (const st of sky[p]) ctx.fillRect(st.x * W, st.y * H, st.size, st.size);
    }

    const galAlpha = 1 - clamp01((L - (L1 - 2.2)) / 1.8);
    if (galAlpha > 0) {
      const cgx = c.x * cosR + c.y * sinR;
      const cgy = -c.x * sinR + c.y * cosR;
      ctx.setTransform(dpr * cosR, dpr * sinR, -dpr * sinR, dpr * cosR, ax * dpr, ay * dpr);
      ctx.globalCompositeOperation = "lighter";

      const gx = -cgx * s;
      const gy = -cgy * s;
      const coreR = GAL_R * 0.3 * s;
      if (coreR < 20000) {
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, coreR);
        glow.addColorStop(0, "rgba(255, 214, 140, 0.55)");
        glow.addColorStop(0.4, "rgba(255, 140, 55, 0.15)");
        glow.addColorStop(1, "rgba(166, 51, 214, 0)");
        ctx.globalAlpha = galAlpha;
        ctx.fillStyle = glow;
        ctx.fillRect(gx - coreR, gy - coreR, coreR * 2, coreR * 2);
      }

      const half = Math.hypot(W, H) + 4;
      const grow = Math.min(3, Math.pow(s / Math.exp(L0), 0.12));
      for (const g of galaxy.groups) {
        ctx.globalAlpha = g.alpha * galAlpha;
        ctx.fillStyle = g.color;
        const { xs, ys, sizes } = g;
        for (let i = 0; i < xs.length; i += stride) {
          const x = (xs[i] - cgx) * s;
          const y = (ys[i] - cgy) * s;
          if (x < -half || x > half || y < -half || y > half) continue;
          const sz = sizes[i] * grow;
          ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const [sx, sy] = toScreen(S.x, S.y);
    const sunPx = Math.max(2, SUN_R * s);
    const glowR = sunPx * 7 + 10;
    const sunGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
    sunGlow.addColorStop(0, "rgba(241, 196, 15, 0.9)");
    sunGlow.addColorStop(0.25, "rgba(255, 140, 55, 0.35)");
    sunGlow.addColorStop(1, "rgba(236, 55, 80, 0)");
    ctx.globalAlpha = smooth((t - T.hold) / 0.8);
    ctx.fillStyle = sunGlow;
    ctx.fillRect(sx - glowR, sy - glowR, glowR * 2, glowR * 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff6d5";
    ctx.beginPath();
    ctx.arc(sx, sy, sunPx, 0, Math.PI * 2);
    ctx.fill();

    const solarAlpha = smooth((L - (L1 - 2)) / 1.5);
    let earthPx = 0;
    let ex = 0;
    let ey = 0;
    if (solarAlpha > 0) {
      for (const p of PLANETS) {
        const isEarth = p === EARTH;
        const ang = isEarth
          ? earthAng
          : earthAngle0 + 1.3 * p.orbit + t * 0.156 * Math.pow(EARTH.orbit / p.orbit, 1.5);
        const pos = isEarth ? E : { x: S.x + p.orbit * Math.cos(ang), y: S.y + p.orbit * Math.sin(ang) };
        const [px, py] = toScreen(pos.x, pos.y);

        const orbitPx = p.orbit * s;
        if (orbitPx < 40000) {
          ctx.globalAlpha = solarAlpha * (isEarth ? 0.55 : 0.18);
          ctx.strokeStyle = isEarth ? brand.red : "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx, sy, orbitPx, 0, Math.PI * 2);
          ctx.stroke();
        }

        const pr = Math.max(1.5, p.r * s);
        if (isEarth) {
          earthPx = p.r * s;
          ex = px;
          ey = py;
        }
        const dotAlpha = isEarth ? 1 - smooth((earthPx - 4) / 6) : 1;
        if (dotAlpha <= 0) continue;
        if (px < -pr * 3 || px > W + pr * 3 || py < -pr * 3 || py > H + pr * 3) continue;
        ctx.globalAlpha = solarAlpha * dotAlpha;
        ctx.fillStyle = isEarth ? "#ffffff" : p.color;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
        if (isEarth) {
          ctx.fillStyle = brand.red;
          ctx.beginPath();
          ctx.arc(px - pr * 0.2, py - pr * 0.1, pr * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        if (p.ring && pr > 2) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, pr * 0.25);
          ctx.beginPath();
          ctx.ellipse(px, py, pr * 2.1, pr * 0.7, -0.4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    const mapAlpha = smooth((earthPx - 4) / 6);
    mapEl.style.opacity = mapAlpha;
    if (mapAlpha > 0) {
      mapEl.style.transform = `translate3d(${ex - mcx}px, ${ey - mcy}px, 0) scale(${earthPx / R})`;
    }

    const next = L < L1 - 1.5 ? "The Milky Way" : L < L1b + 0.8 ? "The Solar System" : "Earth";
    if (next !== label) onCaption((label = next));

    if (t >= T.earth && !frozen) return finish();
    rafId = requestAnimationFrame(frame);
  }

  function cleanup() {
    done = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
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
