<script>
  import "../app.css";
  import { page } from "$app/state";
  let { children } = $props();

  import { onMount } from "svelte";

  const path = $derived(page.url.pathname.replace(/\/$/, ""));
  const mock = $derived(path.startsWith("/mock") || path.startsWith("/original"));
  const hasGlobe = $derived(!path.startsWith("/original"));

  const REPLAY_KEY = "hc-club-globe-replay";
  let replay = $state(false);
  onMount(() => {
    try {
      replay = localStorage.getItem(REPLAY_KEY) === "1";
    } catch {}
  });
  function setReplay(on) {
    replay = on;
    try {
      if (on) localStorage.setItem(REPLAY_KEY, "1");
      else localStorage.removeItem(REPLAY_KEY);
    } catch {}
  }
  const sites = [
    ["hackclub", "hackclub.com"],
    ["clubs", "clubs.hackclub.com"],
  ];
</script>

{#if !mock}
  <nav class="nav">
    <a class="brand" href="/">Hack Club <span>Clubs</span></a>
    <div class="links">
      <a href="/">Home</a>
      <a href="/explore/map">Club map</a>
      <a href="/mock/hackclub">Mockups</a>
    </div>
  </nav>
{/if}

{@render children()}

{#if hasGlobe}

  <div class="replay" class:below-nav={!mock}>
    <label>
      <input type="checkbox" checked={replay} onchange={(e) => setReplay(e.currentTarget.checked)} />
      Replay intro on reload
    </label>
    {#if replay}<button type="button" onclick={() => location.reload()}>↻ Replay now</button>{/if}
  </div>
{/if}

{#if mock}

  <nav class="switcher" aria-label="Compare views">
    {#each sites as [slug, label], i}
      {#if i}<i class="sep"></i>{/if}
      <span>{label}</span>
      {#each [["original", "Original"], ["mock", "Mockup"]] as [kind, name]}
        {@const href = `/${kind}/${slug}`}
        <a {href} aria-current={path === href ? "page" : undefined}>{name}</a>
      {/each}
    {/each}
    <i class="sep"></i>
    <a href="/explore/map">Full map</a>
  </nav>
{/if}

<style>
  .replay {
    position: fixed;
    left: 16px;
    bottom: 16px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px 6px 12px;
    font: 600 13px var(--font);
    color: var(--dark);
    background: rgba(255, 255, 255, 0.96);
    border: 2px solid var(--dark);
    border-radius: 999px;
    box-shadow: 3px 3px 0 var(--dark);
  }
  .replay label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  .replay input {
    accent-color: var(--red);
    width: 15px;
    height: 15px;
  }
  .replay button {
    padding: 4px 10px;
    font: inherit;
    color: #fff;
    background: var(--red);
    border: 0;
    border-radius: 999px;
    cursor: pointer;
  }

  .replay.below-nav {
    top: 64px;
    bottom: auto;
  }
  @media (max-width: 1100px) {
    .replay:not(.below-nav) {
      bottom: 70px;
    }
  }
  .switcher {
    position: fixed;
    left: 50%;
    bottom: 16px;
    z-index: 100;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px;
    font: 600 13px var(--font);
    background: rgba(255, 255, 255, 0.96);
    border: 2px solid var(--dark);
    border-radius: 999px;
    box-shadow: 3px 3px 0 var(--dark);
    white-space: nowrap;
  }
  .switcher span {
    padding: 0 6px 0 8px;
    color: var(--muted);
  }
  .switcher .sep {
    width: 2px;
    height: 20px;
    margin: 0 4px;
    background: #d5d9e0;
  }
  .switcher a {
    padding: 6px 10px;
    color: var(--dark);
    text-decoration: none;
    border-radius: 999px;
  }
  .switcher a[aria-current="page"] {
    color: #fff;
    background: var(--red);
  }
  @media (max-width: 720px) {
    .switcher span {
      display: none;
    }
    .switcher {
      font-size: 12px;
    }
  }
</style>
