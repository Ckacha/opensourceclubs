<script>
  import { onMount } from "svelte";

  import "../../../../lib/hcsite/styles/site.css";
  import { theme, initTheme } from "../../../../lib/hcsite/utils/theme.svelte.js";
  import { useT } from "../../../../lib/hcsite/utils/i18n.js";

  import Navbar from "../../../../lib/hcsite/sections/Navbar.svelte";
  import Footer from "../../../../lib/hcsite/sections/Footer.svelte";
  import ClubGlobe from "../../../../lib/globe/ClubGlobe.svelte";

  let { data } = $props();

  const t = useT("Clubs");
  const [titleStart, titleAccent, titleEnd] = t("heroTitle").split(/<\/?accent>/);
  const [noteStart, noteLink] = t("memberSignIn").split(/<\/?link>/);
  const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17].map((n) => `/hcsite/assets/backImg${n}.webp`);
  const STICKERS = Array.from({ length: 11 }, (_, i) => `/hcsite/assets/hero_sticker${i + 1}.webp`);

  const shuffle = (list) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const build = (photos, stickers) =>
    photos.flatMap((src, i) => (i % 2 ? [{ src, kind: "photo" }, { src: stickers[(i - 1) / 2], kind: "sticker" }] : [{ src, kind: "photo" }]));

  let orbit = $state(build(IMAGES.slice(0, 6), STICKERS.slice(0, 3)));

  onMount(() => {
    initTheme();
    orbit = build(shuffle(IMAGES).slice(0, 6), shuffle(STICKERS).slice(0, 3));
  });
</script>

<svelte:head>
  <title>Clubs · Hack Club mockup</title>
</svelte:head>

<div class="hcsite" class:dark={theme.dark}>
  <Navbar />

  <main id="main" tabindex="-1">
    <section class="globe-wrap">
      <ClubGlobe
        clubs={data.clubs}
        variant="full"
        intro="always"
        spin
        cooperative
        {orbit}
        look={theme.dark ? "dark" : "light"}
        center={[-40, 25]}
        zoom={1.45}
        class="clubs-stage"
      >
        <div class="copy">
          <p class="eyebrow">{t("heroEyebrow")}</p>
          <h1>{titleStart}<span>{titleAccent}</span>{titleEnd}</h1>
          <p class="lead">{t("heroCopy")}</p>
          <div class="actions">
            <a class="cta-btn button red">{t("startClub")} <span class="btn-arrow">→</span></a>
            <a class="button outline">{t("signIn")}</a>
          </div>
          <p class="note">{noteStart}<a>{noteLink}</a></p>
        </div>
      </ClubGlobe>
    </section>
  </main>

  <Footer />
</div>

<style>
  .globe-wrap {
    padding: 96px clamp(12px, 3vw, 40px) 200px;
  }

  .globe-wrap :global(.clubs-stage) {
    height: calc(100vh - 112px);
    min-height: 560px;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }

  .globe-wrap :global(.clubs-stage .map) {
    left: 38%;
  }

  .copy {
    position: absolute;
    left: clamp(24px, 5vw, 72px);
    top: 50%;
    transform: translateY(-50%);
    width: min(480px, 36%);
    color: #fff9ed;
    transition: color 0.4s ease;
  }
  :global(.stage.look-light) .copy {
    color: #17171d;
  }
  :global(.stage.look-light) h1 span {
    color: var(--red);
  }

  .eyebrow {
    margin: 0 0 10px;
    font: 700 15px/1 var(--font-phantom);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-family: var(--font-zarathustra);
    font-size: clamp(44px, 5.6vw, 84px);
    font-weight: 400;
    letter-spacing: -0.035em;
    line-height: 0.88;
  }

  h1 span {
    display: block;
    color: #ffcf40;
    transform: rotate(-2deg);
  }

  .lead {
    margin: 24px 0 0;
    font: clamp(18px, 1.6vw, 24px)/1.2 var(--font-phantom);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding: 0 24px;
    border-radius: 10px;
    font: 700 20px/1 var(--font-phantom);
    text-decoration: none;
    cursor: pointer;
  }
  .button.red {
    color: #fff;
    background: var(--red);
    box-shadow: 4px 5px 0 rgba(23, 23, 29, 0.32);
  }
  .button.outline {
    border: 3px solid currentColor;
    border-radius: 9999px;
    color: inherit;
    transition:
      background 0.18s,
      color 0.18s;
  }
  .button.outline:hover {
    background: #fff9ed;
    color: #17171d;
  }
  :global(.stage.look-light) .button.outline:hover {
    background: #17171d;
    color: #fff9ed;
  }

  .note {
    margin: 14px 0 0;
    font: 400 15px/1.3 var(--font-phantom);
    opacity: 0.75;
  }
  .note a {
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }

  .copy > * {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.5s ease,
      transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2);
  }
  :global(.stage:is([data-phase="fading"], [data-phase="done"])) .copy > * {
    opacity: 1;
    transform: none;
  }
  :global(.stage:is([data-phase="fading"], [data-phase="done"])) .copy > .note {
    opacity: 0.75;
  }
  .copy > :nth-child(2) { transition-delay: 0.1s; }
  .copy > :nth-child(3) { transition-delay: 0.2s; }
  .copy > :nth-child(4) { transition-delay: 0.3s; }
  .copy > :nth-child(5) { transition-delay: 0.4s; }

  @media (max-width: 760px) {
    .globe-wrap :global(.clubs-stage) {
      height: auto;
      min-height: 900px;
    }
    .globe-wrap :global(.clubs-stage .map) {
      left: 0;
      top: 45%;
    }
    .copy {
      top: 28px;
      left: 20px;
      right: 20px;
      width: auto;
      transform: none;
    }
  }
</style>
