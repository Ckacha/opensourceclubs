<script>
  import { onMount } from "svelte";
  import { useT } from "../utils/i18n.js";
  import { href } from "../utils/links.js";
  import BtnArrow from "../components/BtnArrow.svelte";
  import EmailSignup from "../components/EmailSignup.svelte";
  import StickerEnvelope from "../components/StickerEnvelope.svelte";
  import Wave from "../components/Wave.svelte";

  const t = useT("Home");
  const tc = useT("Common");

  const P = (n, bbX, bbY, rotate, zIndex, parallaxRate, side = "left") => ({
    src: `/hcsite/assets/hero_photo${n}.webp`,
    bbX,
    bbY,
    bbW: 390,
    bbH: 290,
    w: 370,
    h: 260,
    rotate,
    zIndex,
    scale: 0.78,
    parallaxRate,
    side,
  });

  const left = [
    P(1, -140, 65, -8, 8, 0.15),
    P(2, -185, 225, 16, 7, 0.12),
    P(3, -170, 365, -14, 7, 0.09),
    P(4, -140, 495, 11, 8, 0.07),
    P(5, -95, 610, -20, 9, 0.05),
    P(6, -100, 695, 22, 8, 0.04),
    P(7, -5, 725, -9, 10, 0.03),
  ];

  const right = [
    P(8, 1680, 70, 10, 8, 0.15, "right"),
    P(9, 1710, 230, -16, 7, 0.12, "right"),
    P(10, 1690, 370, 13, 7, 0.09, "right"),
    P(11, 1665, 500, -11, 8, 0.07, "right"),
    P(12, 1640, 615, 20, 8, 0.05, "right"),
    P(13, 1555, 715, -10, 10, 0.03, "right"),
  ];

  const stickers = [
    { src: "hero_sticker1", left: "calc(75 / 1920 * 100vw)", top: "calc(266 / 1080 * 100vh)", rotate: 18, width: "calc(141 / 1920 * 100vw)" },
    { src: "hero_sticker2", left: "calc(215 / 1920 * 100vw)", top: "calc(663 / 1080 * 100vh)", rotate: -24, width: "calc(65 / 1920 * 100vw)" },
    { src: "hero_sticker3", left: "calc(300 / 1920 * 100vw)", top: "calc(768 / 1080 * 100vh)", rotate: 13, width: "calc(81 / 1920 * 100vw)" },
    { src: "hero_sticker7", right: "calc(100 / 1920 * 100vw)", top: "calc(285 / 1080 * 100vh)", rotate: -16, width: "calc(112 / 1920 * 100vw)" },
    { src: "hero_sticker5", right: "calc(155 / 1920 * 100vw)", top: "calc(528 / 1080 * 100vh)", rotate: 22, width: "calc(89 / 1920 * 100vw)" },
    { src: "hero_sticker6", right: "calc(280 / 1920 * 100vw)", top: "calc(767 / 1080 * 100vh)", rotate: -9, width: "calc(65 / 1920 * 100vw)" },
  ].map((s) => ({ ...s, x: 0, y: 0, dragging: false, hovered: false }));

  let stickerState = $state(stickers);
  let hoveredPhoto = $state(null);
  let photoLeaveTimer;
  let magHover = $state("idle");
  let magTimer;
  let sectionEl;
  let magazineEl;

  function photoEdge(p) {
    return p.side === "right" ? `right: ${-(p.bbX + p.bbW - 1920)}px` : `left: ${p.bbX}px`;
  }

  function photoSlide(p) {
    const hidden = p.side === "right" ? p.bbX + p.bbW - 1920 : Math.abs(p.bbX);
    const mag = Math.max(hidden + 80, 160);
    const x = p.side === "right" ? -mag : mag;
    const y = p.bbY + p.bbH / 2 < 450 ? 40 : -40;
    return `translateX(${x}px) translateY(${y}px)`;
  }
  
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stickerDown(e, s) {
    e.preventDefault();
    s.dragging = true;
    const o = { mx: e.clientX, my: e.clientY, ox: s.x, oy: s.y };
    const move = (ev) => {
      s.x = o.ox + (ev.clientX - o.mx);
      s.y = o.oy + (ev.clientY - o.my);
    };
    const up = () => {
      s.dragging = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }
  function stickerStyle(s) {
    const lift = s.dragging ? 14 : s.hovered ? 6 : 0;
    const scale = s.dragging ? 1.1 : s.hovered ? 1.05 : 1;
    const pos = s.left ? `left: ${s.left};` : `right: ${s.right};`;
    return `${pos} top: ${s.top}; width: ${s.width}; z-index: ${s.dragging ? 1000 : 30}; cursor: ${s.dragging ? "grabbing" : "grab"};
      transform: translate(${s.x}px, ${s.y - lift}px) scale(${scale});
      transition: ${s.dragging ? "none" : "transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.25s ease"};
      filter: ${s.hovered || s.dragging ? `drop-shadow(0 ${lift}px ${lift + 6}px rgba(0,0,0,0.28))` : "drop-shadow(0 2px 4px rgba(0,0,0,0.12))"}`;
  }

  onMount(() => {
    const els = Array.from(sectionEl.querySelectorAll("[data-parallax-rate]"));
    let top = 0;
    let visible = true;
    let raf = null;
    const measure = () => (top = sectionEl.getBoundingClientRect().top + scrollY);
    const reset = () => {
      magazineEl.style.transform = "translate3d(-50%, 0, 0)";
      for (const el of els) el.style.transform = "translate3d(0, 0, 0)";
    };
    const apply = () => {
      raf = null;
      if (reduced()) return reset();
      const rel = Math.max(0, scrollY - top);
      magazineEl.style.transform = `translate3d(-50%, ${rel * 0.4}px, 0)`;
      for (const el of els) el.style.transform = `translate3d(0, ${rel * parseFloat(el.dataset.parallaxRate)}px, 0)`;
    };
    const schedule = () => {
      if (reduced() || !visible || raf !== null) return;
      raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    measure();
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e?.isIntersecting ?? false;
        if (visible) onResize();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(sectionEl);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", onResize);
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  });
</script>

<section bind:this={sectionEl} class="hero">
  <div class="layer" style="z-index: 0">
    <div class="magazine" bind:this={magazineEl}>
      <img src="/hcsite/assets/background.webp" alt="" width="1920" height="840" />
    </div>
  </div>

  <div class="layer" style="z-index: 1">
    {#each [["hero-photos-left", left], ["hero-photos-right", right]] as [cls, list]}
      <div class={cls}>
        {#each list as p}
          <div
            data-parallax-rate={p.parallaxRate}
            class="photo-outer"
            style="{photoEdge(p)}; top: {p.bbY}px; width: {p.bbW}px; height: {p.bbH}px; z-index: {p.zIndex}"
          >
            <div class="photo-mid" style:transform={hoveredPhoto === p.src && !reduced() ? photoSlide(p) : "none"}>
              <div
                class="photo"
                role="presentation"
                onmouseenter={() => {
                  clearTimeout(photoLeaveTimer);
                  hoveredPhoto = p.src;
                }}
                onmouseleave={() => (photoLeaveTimer = setTimeout(() => (hoveredPhoto = null), 200))}
                style="width: {p.w}px; height: {p.h}px; transform: translate(-50%, -50%) rotate({p.rotate}deg) scale({p.scale})"
              >
                <img src={p.src} alt="" />
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div class="hero-stickers">
    {#each stickerState as s}
      <div
        class="sticker"
        role="presentation"
        aria-hidden="true"
        onmousedown={(e) => stickerDown(e, s)}
        onmouseenter={() => (s.hoverTimer = setTimeout(() => (s.hovered = true), 150))}
        onmouseleave={() => {
          clearTimeout(s.hoverTimer);
          if (!s.dragging) s.hovered = false;
        }}
        style={stickerStyle(s)}
      >
        <img
          src="/hcsite/assets/{s.src}.webp"
          alt=""
          draggable="false"
          style="transform: rotate({s.rotate + (s.dragging ? 4 : 0)}deg); transition: {s.dragging ? 'none' : 'transform 0.25s ease'}"
        />
      </div>
    {/each}
  </div>

  <div class="hero-center">
    <a
      href={href("https://stardance.hackclub.com/hackclubsite")}
      target="_blank"
      rel="noopener"
      class="mag-link hero-mag-link"
      data-state={magHover}
      style:color={magHover === "in" ? "#ffffff" : "var(--muted)"}
      onmouseenter={() => (magTimer = setTimeout(() => (magHover = "in"), 10))}
      onmouseleave={() => {
        clearTimeout(magTimer);
        magHover = magHover === "in" ? "out" : "idle";
      }}
    >
      <img src="/hcsite/cdn/star.svg" alt="" width="177" height="222" class="star" />
      {t("stardance")}
      <span class="btn-arrow" aria-hidden="true"><BtnArrow wrap={false} /></span>
    </a>

    <h1>
      {t("headlineWhere")}<span class="teens">{t("headlineTeens")}</span><br />{t("headlineRest")}
    </h1>

    <p class="sub">{t("subtext")}</p>

    <div style="pointer-events: auto"><EmailSignup variant="hero" /></div>

    <p class="terms">
      <span>{tc("termsAgree")}</span>
      <a href={href("/privacy-and-terms")}>{tc("terms")}</a>
    </p>

    <div class="envelope"><StickerEnvelope /></div>
  </div>

  <img src="/hcsite/assets/creature1.webp" alt="" width="1867" height="1485" class="creature" />

  <Wave position="bottom" color="var(--background)" />
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(236, 55, 80, 0.04) 60%, rgba(236, 55, 80, 0.4) 100%);
  }
  .layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .magazine {
    position: absolute;
    bottom: 40px;
    left: 50%;
    min-width: 900px;
    width: 100%;
    transform: translate3d(-50%, 0, 0);
    mask-image: linear-gradient(to top, black 40%, transparent 75%);
    -webkit-mask-image: linear-gradient(to top, black 40%, transparent 75%);
    will-change: transform;
  }
  .magazine img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 1023px) {
    .hero-photos-left,
    .hero-photos-right,
    .hero-stickers {
      display: none;
    }
    .hero-center {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
    .hero-mag-link {
      display: none !important;
    }
  }
  
  .photo-outer {
    position: absolute;
    pointer-events: none;
    will-change: transform;
  }
  .photo-mid {
    width: 100%;
    height: 100%;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .photo {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 4px solid var(--paper);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
    pointer-events: auto;
    cursor: pointer;
  }
  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sticker {
    position: absolute;
    pointer-events: auto;
    user-select: none;
  }
  .sticker img {
    width: 100%;
    height: auto;
    display: block;
  }
  .hero-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    padding: 80px 0 100px;
    pointer-events: none;
  }
  .mag-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    font-family: var(--font-phantom);
    font-size: 20px;
    text-decoration: none;
    text-align: center;
    margin-bottom: 18px;
    pointer-events: auto;
    position: relative;
    overflow: hidden;
    padding: 0 1px;
    transition: color 0.15s;
    isolation: isolate;
  }
  .mag-link::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #ec3750;
    transform: translateX(-101%);
    z-index: -1;
  }
  .mag-link[data-state="in"]::before {
    animation: mag-bg-in 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  .mag-link[data-state="out"]::before {
    animation: mag-bg-out 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards;
  }
  .mag-link .btn-arrow {
    display: inline-flex;
    align-items: center;
  }
  @keyframes mag-bg-in {
    from {
      transform: translateX(-101%);
    }
    to {
      transform: translateX(0%);
    }
  }
  @keyframes mag-bg-out {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(101%);
    }
  }
  .star {
    width: 18px;
    height: auto;
    display: block;
    flex-shrink: 0;
  }
  h1 {
    font-family: var(--font-zarathustra);
    font-size: clamp(52px, 12vw, 90px);
    font-weight: normal;
    line-height: 0.92;
    color: var(--foreground);
    margin: 0 0 16px;
    text-align: center;
  }
  .teens {
    background: repeating-linear-gradient(
      105deg,
      #ec3750 0%,
      #ff8c37 16%,
      #f1c40f 32%,
      #33d6a6 48%,
      #338eda 64%,
      #a633d6 80%,
      #ec3750 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: teens-gradient 6s linear infinite;
  }
  @keyframes teens-gradient {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }
  .sub {
    font-family: var(--font-phantom);
    font-weight: normal;
    font-size: 20px;
    color: var(--foreground);
    margin: 0 0 32px;
    line-height: 1.2;
    text-align: center;
    max-width: min(600px, calc(100vw - 64px));
  }
  .terms {
    font-family: var(--font-phantom);
    font-style: italic;
    font-weight: normal;
    font-size: 16px;
    line-height: 1.35;
    color: var(--foreground);
    margin: 10px 0 0;
    padding: 10px 16px;
    max-width: min(680px, calc(100vw - 48px));
    background: var(--nav-bg);
    border: 1px solid var(--border);
    border-radius: 9999px;
    box-shadow: 0 10px 28px rgba(23, 23, 29, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: auto;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 4px;
  }
  .terms a {
    color: var(--red-text);
    text-decoration: underline;
    text-underline-offset: 2px;
    white-space: nowrap;
  }
  .envelope {
    pointer-events: auto;
    margin-top: 28px;
    display: flex;
    justify-content: center;
  }
  .creature {
    position: absolute;
    right: 0;
    bottom: 20px;
    width: calc(544 / 1920 * 100vw);
    height: auto;
    transform: translateY(calc(50% - 8px));
    z-index: 25;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .teens {
      animation: none;
    }
  }
</style>
