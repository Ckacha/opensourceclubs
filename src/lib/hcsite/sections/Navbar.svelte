<script>
  import { onMount } from "svelte";
  import { useT } from "../utils/i18n.js";
  import { href } from "../utils/links.js";
  import ThemeToggle from "../components/ThemeToggle.svelte";

  const t = useT("Nav");
  const tc = useT("Common");

  const about = [
    [t("philosophy"), "/philosophy"],
    [t("philanthropy"), "/philanthropy"],
    [t("teamBoard"), "/team"],
    [t("jobs"), "/jobs"],
    [t("brandingGuide"), "/brand"],
    [t("pressInquiries"), "/press"],
    [t("parents"), "/parents"],
  ];
  const resources = [
    [t("shop"), "https://shop.hackclub.com"],
    [t("toolbox"), "https://toolbox.hackclub.com"],
    [t("conduct"), "/conduct"],
    [t("privacy"), "/privacy-and-terms"],
    [t("safety"), "/safety"],
  ];
  const links = [
    { label: t("about"), dropdown: about },
    { label: t("programs"), href: "/programs" },
    { label: t("clubs"), href: "/clubs" },
    { label: t("hcb"), href: "/fiscal-sponsorship" },
    { label: t("hackathons"), href: "https://hackathons.hackclub.com" },
    { label: t("resources"), dropdown: resources },
    { label: t("donate"), href: "/philanthropy" },
  ];

  let menuState = $state("closed");
  let openDd = $state(null);
  let scrolled = $state(false);
  let ddTimer;
  let closeTimer;

  const mounted = $derived(menuState !== "closed");
  const isOpen = $derived(menuState === "opening" || menuState === "open");
  const ddId = (l) => `dropdown-${l.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function enter(l) {
    clearTimeout(ddTimer);
    openDd = l;
  }
  function leave() {
    ddTimer = setTimeout(() => (openDd = null), 120);
  }
  function openMenu() {
    clearTimeout(closeTimer);
    if (isOpen) return;
    menuState = "opening";
    requestAnimationFrame(() => (menuState = "open"));
  }
  function closeMenu() {
    clearTimeout(closeTimer);
    if (menuState === "closed" || menuState === "closing") return;
    menuState = "closing";
    closeTimer = setTimeout(() => (menuState = "closed"), 240);
  }

  $effect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === "Escape" && closeMenu();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  });

  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(ddTimer);
      clearTimeout(closeTimer);
    };
  });
</script>

<nav class="navbar-shell" class:scrolled>
  <a href={href("/")} class="logo">
    <img src="/hcsite/assets/hackClubLogoRed.svg" alt="Hack Club" height="48" />
  </a>

  <div class="desktop">
    {#each links as l}
      {#if l.dropdown}
        <div
          class="dd"
          role="presentation"
          onmouseenter={() => enter(l.label)}
          onmouseleave={leave}
          onfocusin={() => enter(l.label)}
          onfocusout={(e) => !e.currentTarget.contains(e.relatedTarget) && leave()}
        >
          <button
            type="button"
            class="nav-link"
            aria-haspopup="menu"
            aria-expanded={openDd === l.label}
            aria-controls={ddId(l.label)}
            style:opacity={openDd === l.label ? 0.6 : 1}
          >
            {l.label}
            <svg class="nav-arrow" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
              <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          {#if openDd === l.label}
            <div class="dropdown-menu" id={ddId(l.label)} role="menu">
              {#each l.dropdown as [label, h]}
                <a href={href(h)} role="menuitem" class="dd-link">{label}</a>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <a href={href(l.href)} class="nav-link">{l.label}</a>
      {/if}
    {/each}

    <ThemeToggle />

    <a href={href("https://slack.hackclub.com")} class="dark-btn nav-cta">{tc("joinCommunity")}</a>
  </div>

  <button
    class="burger"
    onclick={() => (isOpen ? closeMenu() : openMenu())}
    aria-label={tc("toggleMenu")}
    aria-expanded={isOpen}
    aria-controls="mobile-nav-menu"
  >
    {#each [0, 1, 2] as i}
      <span
        class="bar"
        style:transform={i === 0 && isOpen
          ? "translateY(8px) rotate(45deg)"
          : i === 1 && isOpen
            ? "scaleX(0)"
            : i === 2 && isOpen
              ? "translateY(-8px) rotate(-45deg)"
              : "none"}
        style:opacity={i === 1 && isOpen ? 0 : 1}
      ></span>
    {/each}
  </button>
</nav>

<div class="mobile-spacer" aria-hidden="true"></div>
{#if mounted}

  <div class="mobile-nav-overlay" id="mobile-nav-menu" data-state={menuState} aria-hidden={!isOpen}>
    <div class="mobile-nav-panel">
      {#each links as l}
        <div class="mobile-nav-item">
          {#if l.href}
            <a href={href(l.href)} class="m-link" onclick={closeMenu}>{l.label}</a>
          {:else}
            <span class="m-link">{l.label}</span>
          {/if}
          {#if l.dropdown}
            <div class="m-sub">
              {#each l.dropdown as [label, h]}
                <a href={href(h)} onclick={closeMenu}>{label}</a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
      <a href={href("https://slack.hackclub.com")} class="dark-btn mobile-nav-item m-cta" onclick={closeMenu}>{tc("joinCommunity")}</a>
      <div class="mobile-nav-item m-theme"><ThemeToggle /></div>
    </div>
  </div>
{/if}

<style>
  .navbar-shell {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: clamp(16px, 4vw, 55px);
    height: 80px;
    z-index: 1100;
    border-bottom: 1px solid transparent;
    transition:
      background 300ms ease,
      border-color 300ms ease,
      backdrop-filter 300ms ease;
  }

  @media (min-width: 1024px) {
    .navbar-shell {
      position: absolute;
    }
  }
  @media (max-width: 1023px) {
    .navbar-shell.scrolled {
      background: var(--nav-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
  }
  .logo {
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  .logo img {
    height: 48px;
    width: auto;
    display: block;
    object-fit: contain;
  }
  .desktop {
    display: none;
    align-items: center;
    gap: 24px;
  }
  
  @media (min-width: 1024px) {
    .desktop {
      display: flex;
    }
  }
  .dd {
    position: relative;
  }
  .nav-link {
    font-family: var(--font-phantom);
    font-weight: normal;
    font-size: 20px;
    color: var(--foreground);
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.15s;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  a.nav-link:hover {
    opacity: 0.6;
  }
  .nav-arrow {
    transition:
      transform 160ms ease,
      opacity 160ms ease;
    opacity: 0.8;
  }
  .nav-link:hover .nav-arrow {
    opacity: 1;
    transform: translateY(1px);
  }
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    background: var(--surface);
    border-radius: 12px;
    box-shadow: var(--shadow-dd);
    padding: 8px;
    min-width: 220px;
    z-index: 100;
    transform: translate3d(-50%, 0, 0);
    animation: ddIn 180ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .dd-link {
    display: block;
    padding: 10px 20px;
    font-family: var(--font-phantom);
    font-size: 18px;
    color: var(--foreground);
    text-decoration: none;
    white-space: nowrap;
    border-radius: 8px;
    transition:
      background-color 200ms ease,
      color 200ms ease,
      padding-left 200ms ease,
      box-shadow 200ms ease;
  }
  .dd-link:hover {
    background-color: var(--surface-hover);
    color: var(--red-text);
    padding-left: 26px;
    box-shadow: 0 4px 12px rgba(236, 55, 80, 0.12);
  }
  @keyframes ddIn {
    from {
      opacity: 0;
      transform: translate3d(-50%, 6px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }
  .nav-cta {
    font-family: var(--font-phantom);
    font-weight: normal;
    font-size: 20px;
    text-decoration: none;
    border-radius: 9999px;
    height: 44px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    flex-shrink: 0;
    color: var(--background);
    background: var(--foreground);
    transition:
      background 180ms ease,
      color 180ms ease;
  }
  .nav-cta:hover {
    background: var(--red);
    color: var(--paper);
  }
  .burger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    margin-left: auto;
  }
  @media (min-width: 1024px) {
    .burger,
    .mobile-spacer,
    .mobile-nav-overlay {
      display: none !important;
    }
  }
  .bar {
    display: block;
    width: 26px;
    height: 3px;
    background: var(--foreground);
    border-radius: 2px;
    transition:
      transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
      opacity 220ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .mobile-spacer {
    height: 80px;
    flex-shrink: 0;
  }
  .mobile-nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 1090;
    display: flex;
    background: var(--nav-bg);
    backdrop-filter: blur(14px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity 220ms cubic-bezier(0.23, 1, 0.32, 1),
      visibility 0ms linear 220ms;
  }
  .mobile-nav-overlay[data-state="opening"],
  .mobile-nav-overlay[data-state="open"],
  .mobile-nav-overlay[data-state="closing"] {
    visibility: visible;
  }
  .mobile-nav-overlay[data-state="open"] {
    opacity: 1;
    pointer-events: auto;
    transition:
      opacity 240ms cubic-bezier(0.23, 1, 0.32, 1),
      visibility 0ms linear 0ms;
  }
  .mobile-nav-panel {
    width: 100%;
    min-height: 100%;
    padding: 104px 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    border-top: 1px solid var(--border);
    transform: translate3d(0, -14px, 0);
    transition: transform 240ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .mobile-nav-overlay[data-state="open"] .mobile-nav-panel {
    transform: translate3d(0, 0, 0);
  }
  .mobile-nav-item {
    opacity: 0;
    transform: translate3d(0, 12px, 0);
    transition:
      transform 240ms cubic-bezier(0.23, 1, 0.32, 1),
      opacity 180ms ease-out;
  }
  .mobile-nav-overlay[data-state="open"] .mobile-nav-item {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  .m-link {
    font-family: var(--font-phantom);
    font-size: 20px;
    color: var(--foreground);
    text-decoration: none;
  }
  .m-sub {
    padding-left: 16px;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .m-sub a {
    font-family: var(--font-phantom);
    font-size: 17px;
    color: var(--muted);
    text-decoration: none;
    opacity: 0.9;
  }
  .m-cta {
    font-family: var(--font-phantom);
    font-size: 20px;
    color: var(--background);
    text-decoration: none;
    background: var(--foreground);
    border-radius: 9999px;
    padding: 10px 24px;
    text-align: center;
    margin-top: 4px;
    display: block;
  }
  .m-theme {
    display: flex;
    justify-content: center;
  }
  @media (prefers-reduced-motion: reduce) {
    .dropdown-menu {
      animation: none;
    }
    .nav-arrow,
    .nav-cta,
    .mobile-nav-overlay,
    .mobile-nav-panel,
    .mobile-nav-item,
    .dd-link {
      transition: none;
    }
    .mobile-nav-panel,
    .mobile-nav-item {
      transform: none;
    }
  }
</style>
