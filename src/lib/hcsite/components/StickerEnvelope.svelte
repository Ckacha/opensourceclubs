<script>
  import { useT } from "../utils/i18n.js";
  import { href } from "../utils/links.js";
  const t = useT("Home");

  const FLY = [
    { src: "/hcsite/assets/hero_sticker1.webp", cls: "sf-kawaii" },
    { src: "/hcsite/assets/hero_sticker3.webp", cls: "sf-yippee" },
    { src: "/hcsite/assets/hero_sticker4.webp", cls: "sf-coke" },
    { src: "/hcsite/assets/hero_sticker7.webp", cls: "sf-boba" },
  ];
</script>

<a
  href={href("https://forms.hackclub.com/t/eLhFehpKG6us")}
  target="_blank"
  rel="noopener"
  class="sticker-envelope"
  aria-label={t("stickersAria")}
>
  <div class="body" aria-hidden="true">
    <div class="paper">
      <div class="from">
        {t("stickerFirstAddress")}<br />{t("stickerSecondAddress")}<br />{t("stickerCountryAddress")}
      </div>
      <div class="stamp">
        <div class="stamp-inner"><img src="/hcsite/assets/hackClubFlag.svg" alt="" /></div>
      </div>
      <svg class="postmark" viewBox="0 0 120 70">
        <circle cx="35" cy="35" r="26" fill="none" stroke="#17171d" stroke-width="2.5" />
        <circle cx="35" cy="35" r="19" fill="none" stroke="#17171d" stroke-width="1.2" />
        <path
          d="M64 22 Q74 18 84 22 T104 22 M64 34 Q74 30 84 34 T104 34 M64 46 Q74 42 84 46 T104 46"
          fill="none"
          stroke="#17171d"
          stroke-width="2.5"
          stroke-linecap="round"
        />

      </svg>
      <div class="to">
        <span class="label">{t("stickerTo")}</span>
        <div class="lines">
          <div class="line">{t("stickerYou")}</div>
          <div class="line second">{t("stickerWhere")}</div>
        </div>
      </div>
    </div>
  </div>

  {#each FLY as s}
    <div class="sticker-fly {s.cls}" aria-hidden="true"><img src={s.src} alt="" draggable="false" /></div>
  {/each}

  <span class="pill">
    {t("stickerGet")}
    <svg class="arrow" aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</a>

<style>
  .sticker-envelope {
    display: block;
    position: relative;
    text-decoration: none;
    container-type: inline-size;
    width: clamp(210px, 16vw, 260px);
    transform: rotate(-3deg);
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  @media (min-width: 1024px) {
    .sticker-envelope {
      margin-top: 28px;
    }
  }
  @media (min-width: 1024px) and (max-height: 850px) {
    .sticker-envelope {
      width: 200px;
      margin-top: 14px;
    }
  }
  
  .body {
    position: relative;
    z-index: 1;
    border-radius: 10px;
    background: repeating-linear-gradient(45deg, #ec3750 0 7px, #fffdf8 7px 14px, #338eda 14px 21px, #fffdf8 21px 28px);
    padding: 8px;
    aspect-ratio: 10 / 6.2;
    box-shadow:
      0 12px 28px rgba(23, 23, 29, 0.18),
      0 3px 7px rgba(23, 23, 29, 0.09);
    transition: box-shadow 0.28s ease;
  }
  .paper {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(155deg, #fffefb 0%, #fdfaf2 55%, #f9f3e6 100%);
    border-radius: 5px;
    overflow: hidden;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      inset 0 -6px 14px rgba(23, 23, 29, 0.035);
  }
  .from {
    position: absolute;
    top: 7.5%;
    left: 7%;
    font-family: var(--font-phantom);
    font-size: clamp(7px, 3.5cqw, 9.5px);
    line-height: 1.45;
    letter-spacing: 0.07em;
    color: rgba(23, 23, 29, 0.5);
    white-space: nowrap;
  }
  .stamp {
    position: absolute;
    top: 6.5%;
    right: 5.5%;
    width: 18%;
    aspect-ratio: 82 / 92;
    background: #fff;
    box-shadow: 0 1.5px 4px rgba(23, 23, 29, 0.18);
    transform: rotate(3deg);
    padding: 1.1%;
  }
  .stamp-inner {
    width: 100%;
    height: 100%;
    background: linear-gradient(150deg, #f04a61 0%, #ec3750 45%, #d92c44 100%);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stamp-inner img {
    width: 82%;
    height: auto;
    display: block;
  }
  .postmark {
    position: absolute;
    top: 5%;
    right: 14%;
    width: 26%;
    opacity: 0.48;
    transform: rotate(-6deg);
  }
  .to {
    position: absolute;
    left: 11%;
    right: 11%;
    top: 41%;
    display: flex;
    align-items: flex-start;
    font-family: var(--font-phantom);
    font-style: italic;
    color: #17171d;
    font-size: clamp(10px, 5.6cqw, 14px);
    line-height: 1.05;
  }
  .label {
    color: rgba(23, 23, 29, 0.5);
    font-style: normal;
    margin-right: 2.5%;
    flex-shrink: 0;
  }

  .lines {
    flex: 1;
    min-width: 0;
  }
  .line {
    border-bottom: 1.2px solid rgba(23, 23, 29, 0.35);
  }
  .line.second {
    margin-top: 6.5%;
  }
  .pill {
    position: absolute;
    left: 50%;
    bottom: -16px;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--red);
    color: #fff;
    border-radius: 999px;
    padding: 8px 18px;
    border: 2.5px solid #fffdf8;
    font-family: var(--font-phantom);
    font-size: 16px;
    white-space: nowrap;
    box-shadow:
      0 5px 16px rgba(236, 55, 80, 0.4),
      0 2px 5px rgba(23, 23, 29, 0.14);
    transform: translateX(-50%) rotate(1.5deg);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .arrow {
    transition: transform 0.2s ease;
  }
  .sticker-envelope:hover,
  .sticker-envelope:focus-visible {
    transform: rotate(-1.5deg) translateY(-5px) scale(1.03);
  }
  .sticker-envelope:hover .body,
  .sticker-envelope:focus-visible .body {
    box-shadow:
      0 20px 40px rgba(23, 23, 29, 0.24),
      0 5px 12px rgba(23, 23, 29, 0.11);
  }
  .sticker-envelope:hover .pill,
  .sticker-envelope:focus-visible .pill {
    transform: translateX(-50%) rotate(0deg) scale(1.05);
  }
  .sticker-envelope:hover .arrow,
  .sticker-envelope:focus-visible .arrow {
    transform: translateX(4px);
  }

  .sticker-fly {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    opacity: 0;
    transition:
      transform 0.22s ease-in,
      opacity 0.16s ease-in;
  }
  .sticker-fly img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.16));
  }
  .sticker-envelope:hover .sticker-fly,
  .sticker-envelope:focus-visible .sticker-fly {
    opacity: 1;
  }
  .sf-kawaii {
    left: -9%;
    top: -17%;
    width: 34%;
    transform: translate(-70px, -55px) scale(0.3) rotate(-24deg);
  }
  .sf-yippee {
    right: -9%;
    top: -18%;
    width: 21%;
    transform: translate(60px, -60px) scale(0.3) rotate(22deg);
  }
  .sf-coke {
    right: -8%;
    bottom: 15%;
    width: 27%;
    transform: translate(75px, 30px) scale(0.3) rotate(24deg);
  }
  .sf-boba {
    left: -8.5%;
    bottom: -10%;
    width: 19%;
    transform: translate(-65px, 45px) scale(0.3) rotate(-26deg);
  }
  .sticker-envelope:hover .sf-kawaii,
  .sticker-envelope:focus-visible .sf-kawaii {
    transform: translate(0, 0) scale(1) rotate(-9deg);
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0ms,
      opacity 0.18s ease 0ms;
  }
  .sticker-envelope:hover .sf-yippee,
  .sticker-envelope:focus-visible .sf-yippee {
    transform: translate(0, 0) scale(1) rotate(8deg);
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 50ms,
      opacity 0.18s ease 50ms;
  }
  .sticker-envelope:hover .sf-coke,
  .sticker-envelope:focus-visible .sf-coke {
    transform: translate(0, 0) scale(1) rotate(7deg);
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 100ms,
      opacity 0.18s ease 100ms;
  }
  .sticker-envelope:hover .sf-boba,
  .sticker-envelope:focus-visible .sf-boba {
    transform: translate(0, 0) scale(1) rotate(-8deg);
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 150ms,
      opacity 0.18s ease 150ms;
  }

  @media (hover: none), (max-width: 1023px) {
    .sticker-fly {
      opacity: 1;
      transition: none;
    }
    .sf-kawaii {
      transform: translate(0, 0) scale(1) rotate(-9deg);
    }
    .sf-yippee {
      transform: translate(0, 0) scale(1) rotate(8deg);
    }
    .sf-coke {
      transform: translate(0, 0) scale(1) rotate(7deg);
    }
    .sf-boba {
      transform: translate(0, 0) scale(1) rotate(-8deg);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .sticker-envelope,
    .sticker-envelope:hover,
    .sticker-envelope:focus-visible {
      transform: rotate(-3deg);
      transition: none;
    }
    .pill,
    .sticker-envelope:hover .pill {
      transform: translateX(-50%) rotate(1.5deg);
      transition: none;
    }
    .sticker-fly,
    .sticker-envelope:hover .sticker-fly,
    .sticker-envelope:focus-visible .sticker-fly {
      transition: none;
    }
  }
</style>
