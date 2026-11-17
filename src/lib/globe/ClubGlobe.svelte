<script>
  import { onMount } from "svelte";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { mapStyle } from "./mapStyle.js";
  import { addClubLayers, addClubHover, clubPopup } from "./clubLayers.js";
  import { cursors } from "./cursors.js";
  import { createIntro, FADE_MS, measureGlobeRadius } from "./intro.js";

  let {
    clubs,
    variant = "full",
    intro = "session",
    center = [-40, 30],
    zoom = 1.6,
    class: className = "",
    spin = variant === "hero",
    cooperative = variant === "hero",
    orbit = [],
    look = "space",
    resetButton = variant !== "hero",
    children,
  } = $props();

  let stageEl;
  let canvasEl = $state();
  let moonEl = $state();
  let orbitEls = $state([]);
  let mapEl;

  let phase = $state("pending");
  let skipIntro = () => {};
  let map;

  const WATER = {
    space: ["#ffffff", "#eaf6fb"],
    light: ["#ffffff", "#eaf6fb"],
    dark: ["#2a2a35", "#1f2630"],
  };
  function applyLook() {
    if (!map?.getLayer("water")) return;
    const [far, near] = WATER[look] || WATER.space;
    map.setPaintProperty("water", "fill-color", ["interpolate", ["linear"], ["zoom"], 5, far, 9, near]);
    map.setPaintProperty("waterway", "line-color", near);
  }
  $effect(() => {
    look;
    applyLook();
  });

  function resetView() {
    if (!map) return;
    for (const p of document.querySelectorAll(".maplibregl-popup")) p.remove();
    map.flyTo({ center, zoom, duration: 1200 });
  }

  const STORAGE_KEY = "hc-club-globe-intro";

  const REPLAY_KEY = "hc-club-globe-replay";

  function shouldPlay() {
    if (intro === "never") return false;
    try {
      if (localStorage.getItem(REPLAY_KEY) === "1") return true;
    } catch {

    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (new URLSearchParams(location.search).has("introT")) return true;
    try {
      if (intro === "once") return !localStorage.getItem(STORAGE_KEY);
      if (intro === "session") return !sessionStorage.getItem(STORAGE_KEY);
    } catch {

    }
    return true;
  }

  function rememberPlayed() {
    try {
      if (intro === "once") localStorage.setItem(STORAGE_KEY, "1");
      if (intro === "session") sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {

    }
  }

  onMount(() => {
    let introCtl;
    let destroyed = false;
    let stopSpin = () => {};
    let removeObserver = () => {};
    let spinning = spin;
    const play = shouldPlay();
    if (!play) phase = "done";

    (async () => {

      const [{ Map, Popup, setWorkerUrl }, { default: workerUrl }] = await Promise.all([
        import("maplibre-gl"),
        import("maplibre-gl/dist/maplibre-gl-worker.mjs?url"),
      ]);
      if (destroyed) return;
      setWorkerUrl(workerUrl);

      const hero = variant === "hero";
      map = new Map({
        container: mapEl,
        style: mapStyle,
        center,
        zoom,

        cooperativeGestures: cooperative,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: { compact: true },
      });
      map.touchZoomRotate.disableRotation();
      window.__map = map;

      map.on("load", () => {
        addClubLayers(map, clubs);
        applyLook();
        const hideHover = addClubHover(map, Popup, cursors.pointer, () => touched());

        map.on("click", "clusters", async (e) => {
          const f = e.features[0];
          const z = await map.getSource("clubs").getClusterExpansionZoom(f.properties.cluster_id);
          map.easeTo({ center: f.geometry.coordinates, zoom: z });
        });
        map.on("click", "club-point", (e) => {
          hideHover();
          new Popup({ offset: 10, maxWidth: "260px" })
            .setLngLat(e.features[0].geometry.coordinates)
            .setDOMContent(clubPopup(e.features[0].properties))
            .addTo(map);
        });
      });

      const SPIN_DEG_PER_S = 4.5; 
      const IDLE_MS = 1000; 
      const SPIN_RAMP_S = 2; 
      const RETURN_S = 1.5; 
      let lastTouched = 0;
      const touched = () => (lastTouched = performance.now());
      for (const ev of ["mousedown", "touchstart", "wheel", "click"]) map.on(ev, touched);
      map.on("movestart", (e) => e.originalEvent && touched());
      const ORBIT_SECONDS = 80; 
      const ORBIT_RX = 1.5; 
      const ORBIT_RY = 0.38; 
      const ORBIT_TILT_DEG = -12; 
      const ORBIT_MAX_ZOOM = 2.6; 
      let orbitAngle = 0;
      let globeR = measureGlobeRadius(map);
      const remeasure = () => (globeR = measureGlobeRadius(map));
      map.on("zoom", remeasure);
      map.on("resize", remeasure);
      const tilt = (ORBIT_TILT_DEG * Math.PI) / 180;
      const moveOrbit = (dt, now) => {
        if (!orbitEls.length || phase === "pending" || phase === "playing") return;
        orbitAngle += (dt * Math.PI * 2) / ORBIT_SECONDS;
        const cx = mapEl.offsetLeft + mapEl.offsetWidth / 2;
        const cy = mapEl.offsetTop + mapEl.offsetHeight / 2;
        const hidden = map.getZoom() > ORBIT_MAX_ZOOM;
        orbitEls.forEach((el, i) => {
          if (!el) return;
          const a = orbitAngle + (i * Math.PI * 2) / orbitEls.length;
          const depth = Math.sin(a); 
          const ox = Math.cos(a) * globeR * ORBIT_RX;
          const oy = depth * globeR * ORBIT_RY;
          const bob = Math.sin(now / 900 + i * 1.7) * 5; 
          const x = cx + ox * Math.cos(tilt) - oy * Math.sin(tilt);
          const y = cy + ox * Math.sin(tilt) + oy * Math.cos(tilt) + bob;
          const scale = 0.82 + 0.22 * depth;
          const rot = Math.sin(now / 1400 + i) * 4 + (i % 2 ? 6 : -6);
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`;
          el.style.zIndex = depth > 0 ? "2" : "0";
          el.style.opacity = hidden ? "0" : "1";
        });
      };

      let last = performance.now();
      let raf;
      const spin = (now) => {
        raf = requestAnimationFrame(spin);
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        moveOrbit(dt, now);
        const idle = now - lastTouched - IDLE_MS;
        if (
          !spinning ||
          document.hidden ||
          phase !== "done" ||
          map.isMoving() ||
          idle < 0 ||
          mapEl.querySelector(".maplibregl-popup:not(.club-hover)")
        )
          return;

        const ramp = Math.min(1, idle / (SPIN_RAMP_S * 1000));
        const speed = SPIN_DEG_PER_S * ramp * ramp * (3 - 2 * ramp);

        const k = 1 - Math.exp(-dt / RETURN_S);
        const c = map.getCenter();
        const z = map.getZoom();
        const lat = c.lat + (center[1] - c.lat) * k;
        const zoomNow = z + (zoom - z) * k;
        map.jumpTo({ center: [c.lng - speed * dt, lat], zoom: zoomNow, bearing: 0, pitch: 0 });
      };
      raf = requestAnimationFrame(spin);
      stopSpin = () => cancelAnimationFrame(raf);

      const startIntro = () => {
        if (destroyed || phase !== "pending") return;
        phase = "playing";
        rememberPlayed();
        introCtl = createIntro({
          stage: stageEl,
          canvas: canvasEl,
          moon: moonEl,
          map,
          variant: hero ? "short" : "full",
          onDone: () => {
            phase = "fading";
            map.resize();
            setTimeout(() => {
              phase = "done";
            }, FADE_MS);
          },
        });
        skipIntro = () => introCtl?.skip();
      };

      if (play) {

        let styleReady = false;
        let visible = false;
        const tryStart = () => styleReady && visible && startIntro();
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            visible = true;
            io.disconnect();
            tryStart();
          },
          { threshold: 0.35 },
        );
        io.observe(stageEl);
        removeObserver = () => io.disconnect();
        const onStyle = () => {
          styleReady = true;
          tryStart();
        };
        if (map.isStyleLoaded()) onStyle();
        else {
          map.once("style.load", onStyle);
          setTimeout(onStyle, 2500);
        }
      }
    })();

    const onKey = (e) => {
      if (phase === "playing" && [" ", "Enter", "Escape"].includes(e.key)) skipIntro();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      destroyed = true;
      window.removeEventListener("keydown", onKey);
      stopSpin();
      removeObserver();
      introCtl?.destroy();
      map?.remove();
    };
  });
</script>

<div
  class="stage {variant} look-{look} {className}"
  bind:this={stageEl}
  data-phase={phase}
  style="--cur-grab: {cursors.grab}; --cur-grabbing: {cursors.grabbing}"
>
  <div class="map" bind:this={mapEl}></div>

  {#if phase !== "done"}
    <canvas class="intro" bind:this={canvasEl} onclick={() => skipIntro()} aria-hidden="true"></canvas>
    <div class="moon" bind:this={moonEl} aria-hidden="true"></div>
  {/if}

  {#each orbit as item, i (item.src)}
    <div class="orbiter {item.kind}" class:ready={phase === "fading" || phase === "done"} bind:this={orbitEls[i]} aria-hidden="true">
      <img src={item.src} alt="" />
    </div>
  {/each}

  <div class="overlay">
    {@render children?.()}
  </div>

  {#if resetButton && phase === "done"}
    <button class="reset" type="button" onclick={resetView}>← Back to main view</button>
  {/if}
</div>

<style>
  .stage {
    position: relative;
    overflow: hidden;
    background-color: #0d0d14;
    background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px);
    background-size: 26px 26px;
    transition: background-color 0.4s ease;
  }
  .stage.look-light {
    background-color: #f9fafc;
    background-image: radial-gradient(rgba(23, 23, 29, 0.14) 1px, transparent 1px);
  }
  .stage.look-dark {
    background-color: #17171d;
  }

  .map {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .intro {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    cursor: pointer;
    transition: opacity 0.9s ease;
  }

  .moon {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transform-origin: 50% 50%;
    will-change: transform, opacity;
    background:
      radial-gradient(circle at 30% 35%, rgba(120, 124, 138, 0.55) 0 9%, transparent 10%),
      radial-gradient(circle at 62% 28%, rgba(120, 124, 138, 0.45) 0 6%, transparent 7%),
      radial-gradient(circle at 55% 62%, rgba(120, 124, 138, 0.5) 0 13%, transparent 14%),
      radial-gradient(circle at 28% 70%, rgba(120, 124, 138, 0.4) 0 5%, transparent 6%),
      radial-gradient(circle at 35% 30%, #f4f5f8 0%, #c9ccd6 45%, #7c8090 80%, #4a4d58 100%);
  }

  .orbiter {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    will-change: transform;
    transition: opacity 0.8s ease;
  }
  .orbiter.ready {
    visibility: visible;
  }
  .orbiter img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .orbiter.photo {
    width: clamp(90px, 9vw, 140px);
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 4px solid #fff6eb;
    border-radius: 4px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  }
  .orbiter.photo img {
    object-fit: cover;
  }
  .orbiter.sticker {
    width: clamp(56px, 5.5vw, 84px);
    aspect-ratio: 1;
    filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.3));
  }
  .orbiter.sticker img {
    object-fit: contain;
  }

  .overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.9s ease;
  }

  .overlay > :global(*) {
    pointer-events: auto;
  }

  [data-phase="pending"] .map,
  [data-phase="playing"] .map {
    pointer-events: none;
  }

  :global(html.js) [data-phase="pending"] .map {
    opacity: 0;
  }
  :global(html.js) [data-phase="pending"] .overlay,
  [data-phase="playing"] .overlay {
    opacity: 0;
    pointer-events: none;
  }
  :global(html.js) [data-phase="pending"] .overlay > :global(*),
  [data-phase="playing"] .overlay > :global(*) {
    pointer-events: none;
  }

  .map :global(.maplibregl-control-container) {
    transition: opacity 0.9s ease;
  }
  [data-phase="pending"] .map :global(.maplibregl-control-container),
  [data-phase="playing"] .map :global(.maplibregl-control-container) {
    opacity: 0;
  }
  [data-phase="fading"] .intro,
  [data-phase="fading"] .moon {
    opacity: 0;
    pointer-events: none;
  }

  .hero .map {
    left: 42%;
  }
  @media (max-width: 760px) {
    .hero .map {
      left: 0;
      top: 46%;
    }
  }

  .reset {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 3;
    padding: 10px 16px;
    font: 700 14px var(--font-phantom, system-ui);
    color: #17171d;
    background: #fff;
    border: 2px solid #17171d;
    border-radius: 999px;
    box-shadow: 3px 3px 0 #ec3750;
    cursor: pointer;
  }
  .reset:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #ec3750;
  }

  .stage :global(.maplibregl-canvas-container.maplibregl-interactive) {
    cursor: var(--cur-grab);
  }
  .stage :global(.maplibregl-canvas-container.maplibregl-interactive:active) {
    cursor: var(--cur-grabbing);
  }
  :global(.club-hover) {
    pointer-events: none;
  }
  :global(.club-popup .meta) {
    margin: 0 0 2px;
    font-size: 13px;
    color: #5a5a66;
  }
  :global(.club-popup .hint) {
    margin: 4px 0 0;
    font-size: 11px;
    font-weight: 700;
    color: #8492a6;
  }
  :global(.club-popup .names) {
    margin: 6px 0 2px;
    padding: 0;
    list-style: none;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
    color: #17171d;
  }
  :global(.club-popup h3) {
    color: #17171d;
  }
  :global(.maplibregl-popup-content) {
    padding: 12px 14px;
    border: 2px solid #17171d;
    border-radius: 12px;
    box-shadow: 3px 3px 0 #17171d;
    font-family: var(--font, system-ui);
  }
  :global(.maplibregl-popup-tip) {
    display: none;
  }
  :global(.club-popup .tag) {
    display: inline-block;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    background: #ec3750;
    border-radius: 999px;
  }
  :global(.club-popup h3) {
    margin: 6px 0 4px;
    font-size: 16px;
  }
  :global(.club-popup a) {
    font-size: 13px;
    font-weight: 700;
    color: #ec3750;
    text-decoration: none;
  }
</style>
