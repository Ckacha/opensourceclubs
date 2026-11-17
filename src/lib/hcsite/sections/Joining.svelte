<script>
  import { onMount } from "svelte";
  import { useT } from "../utils/i18n.js";
  import { href } from "../utils/links.js";
  import BtnArrow from "../components/BtnArrow.svelte";
  import Wave from "../components/Wave.svelte";
  import ClubGlobe from "../../globe/ClubGlobe.svelte";

  let { clubs } = $props();
  const t = useT("Home");
  const count = $derived(clubs.features.length);

  const DIGIT = 24;
  let stats = $state(null);
  let animate = $state(false);
  let statsEl = $state();

  onMount(async () => {
    try {
      const r = await fetch("https://slack-data.hackclub.dev/full", { cache: "no-store" });
      if (!r.ok) return;
      const latest = (await r.json()).stats?.at(-1);
      if (!latest) return;
      stats = [
        { value: latest.readers_count_1d, key: "joiningStatOnline", icon: "online" },
        { value: latest.chats_channels_count_1d, key: "joiningStatChannels", icon: "channels" },
        { value: latest.messages_count_1d, key: "joiningStatMessages", icon: "messages" },
        { value: latest.total_members_count, key: "joiningStatMembers", icon: "members" },
      ];
    } catch {}
  });

  $effect(() => {
    if (!statsEl || animate) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animate = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animate = true;
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(statsEl);
    return () => io.disconnect();
  });

  function digits(value) {
    const chars = value.toLocaleString("en-US").split("");
    const idx = chars.flatMap((c, i) => (/\d/.test(c) ? [i] : []));
    return chars.map((c, i) => {
      if (!/\d/.test(c)) return { sep: c };
      const pos = idx.indexOf(i);
      const place = idx.length - pos - 1;
      const loops = Math.max(2, 4 - Math.floor(place / 2));
      const final = loops * 10 + Number(c);
      return { final, place, pos, wheel: Array.from({ length: final + 1 }, (_, k) => k % 10) };
    });
  }
</script>

{#snippet cta(label, link)}
  <a href={href(link)} class="cta-btn card-cta"
    ><span class="cta-inner">{label} <span class="btn-arrow arrow"><BtnArrow wrap={false} /></span></span></a
  >
{/snippet}

{#snippet bg(src)}
  <div class="bg-clip">
    <img {src} alt="" />
    <div class="overlay"></div>
  </div>
{/snippet}

{#snippet glyph(icon)}
  <span class="glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--foreground)" stroke-width="1.8">
      {#if icon === "online"}
        <circle cx="12" cy="12" r="5.2" /><circle cx="12" cy="12" r="2.25" fill="var(--foreground)" stroke="none" />
      {:else if icon === "channels"}
        <path d="M10 3.8L8.8 20.2M15.2 3.8L14 20.2M3.8 10H20.2M3.8 15.2H20.2" stroke-linecap="round" />
      {:else if icon === "messages"}
        <path
          d="M6.1 5.7H17.9C18.9 5.7 19.7 6.5 19.7 7.5V14.6C19.7 15.6 18.9 16.4 17.9 16.4H10.6L6.1 19V7.5C6.1 6.5 5.1 5.7 6.1 5.7Z"
          stroke-linejoin="round"
        />
        <circle cx="9.4" cy="11" r="1" fill="var(--foreground)" stroke="none" /><circle cx="12" cy="11" r="1" fill="var(--foreground)" stroke="none" /><circle
          cx="14.6"
          cy="11"
          r="1"
          fill="var(--foreground)"
          stroke="none"
        />
      {:else}
        <circle cx="9.5" cy="9.2" r="2.7" /><circle cx="15.9" cy="10.4" r="2.1" opacity="0.78" />
        <path d="M4.8 18.8C5.3 15.9 7.5 14.3 9.9 14.3C12.3 14.3 14.6 15.9 15.1 18.8" stroke-linecap="round" />
        <path d="M13.9 18.2C14.1 16.6 15.5 15.5 17 15.5C18.4 15.5 19.7 16.6 19.9 18.2" stroke-linecap="round" opacity="0.78" />
      {/if}
    </svg>
  </span>
{/snippet}

<section class="joining">
  <img src="/hcsite/assets/creature1.webp" alt="" width="544" height="544" class="creature" />
  <Wave position="top" color="var(--surface)" z={25} />

  <div class="section-padded inner">
    <h2>{t("joiningTitle")}</h2>
    <p class="sub">{t("joiningSubtext")}</p>

    <div class="cards">
      <div class="card">
        {@render bg("/hcsite/cdn/joiningCard1Bg.webp")}
        <div class="content joining-card1-content">
          <div class="title-row" style="gap: 7px">
            <img src="/hcsite/cdn/joiningCard1Icon.webp" alt="Slack" width="40" height="40" style="border-radius: 12px; margin-right: 8px" />
            <h3>{t("joiningSlackTitle")}</h3>
          </div>
          <p>{t("joiningSlackBody1")}</p>
          <p class="gap">{t("joiningSlackBody2")}</p>
          {@render cta(t("joiningSlackCta"), "https://slack.hackclub.com/")}
        </div>
        {#if stats}
          <div class="joining-slack-stats" bind:this={statsEl}>
            {#each stats as s, i}
              {@const delay = i * 55}
              <div
                class="stat"
                style="opacity: {animate ? 1 : 0}; transform: {animate ? 'translateX(0)' : 'translateX(12px)'}; transition: opacity 240ms ease-out {delay}ms, transform 280ms cubic-bezier(0.23, 1, 0.32, 1) {delay}ms"
              >
                {@render glyph(s.icon)}
                <span class="stat-text">
                  <span class="odo" style="min-width: {s.value.toLocaleString('en-US').length * 0.62}em">
                    <span aria-hidden="true" class="odo-row">
                      {#each digits(s.value) as d}
                        {#if d.sep}
                          <span class="sep" style="opacity: {animate ? 1 : 0}">{d.sep}</span>
                        {:else}
                          <span class="digit">
                            <span
                              class="wheel"
                              style="transform: {animate ? `translateY(-${d.final * DIGIT}px)` : 'translateY(0)'}; transition: transform {700 +
                                d.place * 130}ms cubic-bezier(0.19, 1, 0.22, 1) {delay + d.pos * 60}ms"
                            >
                              {#each d.wheel as n}<span>{n}</span>{/each}
                            </span>
                          </span>
                        {/if}
                      {/each}
                    </span>
                    <span class="sr">{s.value.toLocaleString("en-US")}</span>
                  </span>
                  <span>{t(s.key)}</span>
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="card">
        {@render bg("/hcsite/cdn/joiningCard2Bg.webp")}
        <img src="/hcsite/cdn/joiningCard2Right.webp" alt="" width="380" height="216" class="joining-card2-deco" />
        <div class="content joining-card-content" style="z-index: 2">
          <div class="title-row" style="gap: 16px">
            <img src="/hcsite/cdn/joiningCard2Icon.webp" alt="HCB" width="50" height="50" />
            <h3>{t("joiningHcbTitle")}</h3>
          </div>
          <div class="joining-card2-body">
            <p>{t("joiningHcbBody1")}</p>
            <p class="gap">{t("joiningHcbBody2")}</p>
          </div>
          {@render cta(t("joiningHcbCta"), "https://hcb.hackclub.com/applications/new")}
        </div>
      </div>

      <div class="card globe-card">
        <ClubGlobe {clubs} variant="hero" intro="always" resetButton class="in-card">
          <div class="content globe-copy">
            <div class="title-row" style="gap: 18px">
              <img src="/hcsite/cdn/joiningCard3Icon.svg" alt="" width="48" height="48" />
              <h3>{t("joiningClubsTitle")}</h3>
            </div>
            <p>{t("joiningClubsBody1")}</p>
            <p class="gap">{t("joiningClubsBody2")}</p>
            <p class="live"><span class="ping"></span>{count} active clubs on the map right now</p>
            {@render cta(t("joiningClubsCta"), "/clubs")}
          </div>
        </ClubGlobe>
      </div>

      <div class="card">
        {@render bg("/hcsite/cdn/joiningCard4Bg.webp")}
        <div class="content joining-card-content">
          <div class="title-row" style="gap: 5px">
            <img src="/hcsite/cdn/joiningCard4Icon.svg" alt="" width="58" height="58" />
            <h3>{t("joiningPerksTitle")}</h3>
          </div>
          <p>{t("joiningPerksBody")}</p>
          {@render cta(t("joiningPerksCta"), "https://toolbox.hackclub.com/")}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .joining {
    background: var(--surface);
    padding: 80px 0 48px;
    position: relative;
  }
  .creature {
    position: absolute;
    right: 0;
    top: -22px;
    width: calc(544 / 1920 * 100vw);
    height: auto;
    transform: translateY(calc(-50% - 8px));
    z-index: 30;
    pointer-events: none;
  }
  .inner {
    max-width: 1366px;
    margin: 0 auto;
    padding-left: clamp(24px, 14.29%, 195px);
    padding-right: clamp(24px, 14.29%, 195px);
  }
  h2 {
    font-family: var(--font-zarathustra);
    font-size: 40px;
    font-weight: normal;
    line-height: 0.9;
    color: var(--foreground);
    margin: 0 0 20px;
    width: 1022px;
    max-width: 100%;
  }
  .sub {
    font-family: var(--font-phantom);
    font-size: 20px;
    color: var(--foreground);
    margin: 0 0 48px;
    line-height: 1.2;
  }
  .cards {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .card {
    position: relative;
    border-radius: 16px;
  }
  .bg-clip {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    overflow: hidden;
    pointer-events: none;
  }
  .bg-clip img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    position: relative;
    z-index: 1;
    padding: 32px 44px;
    max-width: calc(100% - 88px);
  }
  .joining-card1-content {
    max-width: calc(100% - 260px);
  }
  .title-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .title-row img {
    object-fit: contain;
    flex-shrink: 0;
  }
  h3 {
    font-family: var(--font-zarathustra);
    font-size: 40px;
    font-weight: normal;
    line-height: 1;
    color: var(--paper);
    margin: 0;
  }
  .content p {
    font-family: var(--font-phantom);
    font-size: 20px;
    color: var(--paper);
    margin: 0;
    line-height: 1.2;
  }
  .content p.gap {
    margin-top: 1em;
  }
  .card-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    height: 44px;
    background: var(--red);
    color: var(--paper);
    border-radius: 32px;
    font-family: var(--font-phantom);
    font-size: 20px;
    text-decoration: none;
    white-space: nowrap;
    margin-top: 16px;
    line-height: 1;
  }
  .cta-inner {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
  }
  .arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .joining-card2-deco {
    position: absolute;
    right: -60px;
    top: 110px;
    object-fit: cover;
    z-index: 1;
  }
  .joining-card2-body {
    max-width: calc(100% - 340px);
  }
  .joining-slack-stats {
    position: absolute;
    right: -60px;
    top: 32px;
    bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
    justify-content: center;
  }
  .stat {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 52px;
    height: 50px;
    padding: 0 24px 0 14px;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 260px;
  }
  .glyph {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .stat-text {
    font-family: var(--font-phantom);
    font-size: 20px;
    color: var(--foreground);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .odo {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    position: relative;
  }
  .odo-row {
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }
  .sep {
    width: 0.34em;
    text-align: center;
    transition: opacity 200ms ease-out;
  }
  .digit {
    width: 0.62em;
    height: 24px;
    overflow: hidden;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
  }
  .wheel {
    display: inline-flex;
    flex-direction: column;
    will-change: transform;
  }
  .wheel span {
    height: 24px;
    line-height: 24px;
    text-align: center;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .globe-card {
    overflow: hidden;
  }
  .globe-card :global(.stage.in-card) {
    height: 540px;
    border-radius: 16px;
  }
  .globe-card :global(.in-card .map) {
    left: 50% !important;
  }
  .globe-copy {
    position: absolute;
    top: 50%;
    left: 0;
    width: 52%;
    max-width: none;
    transform: translateY(-50%);
  }
  .live {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 1em !important;
    font-weight: 700;
    color: #f1c40f !important;
  }
  .ping {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f1c40f;
    animation: ping 1.8s infinite;
  }
  @keyframes ping {
    0% {
      box-shadow: 0 0 0 0 rgba(241, 196, 15, 0.6);
    }
    70%,
    100% {
      box-shadow: 0 0 0 10px rgba(241, 196, 15, 0);
    }
  }

  @media (max-width: 767px) {
    .joining-slack-stats,
    .joining-card2-deco {
      display: none;
    }
    .content,
    .joining-card1-content {
      max-width: 100%;
      padding: 24px 20px;
    }
    .joining-card2-body {
      max-width: 100%;
    }
    .globe-card :global(.stage.in-card) {
      height: 760px;
    }
    .globe-card :global(.in-card .map) {
      left: 0 !important;
      top: 50% !important;
    }
    .globe-copy {
      top: 0;
      width: 100%;
      transform: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ping {
      animation: none;
    }
  }
</style>
