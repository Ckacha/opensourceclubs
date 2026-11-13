<script>
  import { onMount } from "svelte";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { mapStyle } from "./mapStyle.js";
  import { addClubLayers, clubPopup } from "./clubLayers.js";
  import { createIntro, FADE_MS } from "./intro.js";

  let {
    clubs,
    variant = "full",
    intro = "session",
    center = [-40, 30],
    zoom = 1.6,
    class: className = "",
    children,
  } = $props();

  let stageEl;
  let canvasEl = $state();
  let mapEl;

  let phase = $state("pending");
  let caption = $state("The Milky Way");
  let captionSwap = $state(false);
  let skipIntro = () => {};

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
    let map;
    let introCtl;
    let destroyed = false;
    let captionTimer;
    let stopSpin = () => {};
    let removeObserver = () => {};
    let spinning = variant === "hero";
    const play = shouldPlay();
    if (!play) phase = "done";

    (async () => {

      const [{ Map, Popup, NavigationControl, setWorkerUrl }, { default: workerUrl }] = await Promise.all([
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

        cooperativeGestures: hero,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: { compact: true },
      });
      map.touchZoomRotate.disableRotation();
      if (!hero) map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
      window.__map = map;

      map.on("load", () => {
        addClubLayers(map, clubs);

        map.on("click", "clusters", async (e) => {
          const f = e.features[0];
          const z = await map.getSource("clubs").getClusterExpansionZoom(f.properties.cluster_id);
          map.easeTo({ center: f.geometry.coordinates, zoom: z });
        });
        map.on("click", "club-point", (e) => {
          new Popup({ offset: 10, maxWidth: "260px" })
            .setLngLat(e.features[0].geometry.coordinates)
            .setDOMContent(clubPopup(e.features[0].properties))
            .addTo(map);
        });
        for (const layer of ["clusters", "club-point"]) {
          map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
        }
      });

      const SPIN_DEG_PER_S = 3;
      const SPIN_MAX_ZOOM = 3.5;
      const IDLE_MS = 3000;
      let lastTouched = 0;
      const touched = () => (lastTouched = performance.now());
      for (const ev of ["mousedown", "touchstart", "wheel", "click"]) map.on(ev, touched);
      map.on("movestart", (e) => e.originalEvent && touched());
      let last = performance.now();
      let raf;
      const spin = (now) => {
        raf = requestAnimationFrame(spin);
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        if (
          !spinning ||
          document.hidden ||
          phase !== "done" ||
          map.isMoving() ||
          now - lastTouched < IDLE_MS ||
          map.getZoom() > SPIN_MAX_ZOOM
        )
          return;
        const c = map.getCenter();
        map.jumpTo({ center: [c.lng - SPIN_DEG_PER_S * dt, c.lat] });
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
          map,
          variant: hero ? "short" : "full",
          onCaption: (text) => {
            captionSwap = true;
            clearTimeout(captionTimer);
            captionTimer = setTimeout(() => {
              caption = text;
              captionSwap = false;
            }, 220);
          },
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
      clearTimeout(captionTimer);
      window.removeEventListener("keydown", onKey);
      stopSpin();
      removeObserver();
      introCtl?.destroy();
      map?.remove();
    };
  });
</script>

<div class="stage {variant} {className}" bind:this={stageEl} data-phase={phase}>
  <div class="map" bind:this={mapEl}></div>

  {#if phase !== "done"}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <canvas class="intro" bind:this={canvasEl} onclick={() => skipIntro()} aria-hidden="true"></canvas>
    <div class="caption" class:swap={captionSwap} aria-live="polite">
      <span class="eyebrow">Hack Club</span>
      <span class="where">{caption}</span>
    </div>
    <button class="skip" type="button" onclick={() => skipIntro()}>Skip intro</button>
  {/if}

  <div class="overlay">
    {@render children?.()}
  </div>
</div>

<style>
  .stage {
    position: relative;
    overflow: hidden;
    background-color: #0d0d14;
    background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px);
    background-size: 26px 26px;
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
  [data-phase="fading"] .caption,
  [data-phase="fading"] .skip {
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

  .caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    text-align: center;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }
  .caption .eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #ec3750;
    margin-bottom: 4px;
  }
  .caption .where {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.04em;
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }
  .caption.swap .where {
    opacity: 0;
    transform: translateY(6px);
  }

  .skip {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 3;
    padding: 8px 14px;
    font: 700 13px var(--font, system-ui);
    color: #17171d;
    background: #fff;
    border: 2px solid #17171d;
    border-radius: 999px;
    box-shadow: 3px 3px 0 #ec3750;
    cursor: pointer;
    transition: opacity 0.5s ease;
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
