<script>
  import { onMount } from "svelte";
  let { sources, title } = $props();

  let current = $state(0);
  let available = $state([]);

  onMount(async () => {
    const ok = await Promise.all(
      sources.map(async (s) => {
        if (!s.probe) return true;
        try {
          const sameOrigin = new URL(s.probe, location.href).origin === location.origin;
          const res = await fetch(s.probe, { mode: sameOrigin ? "same-origin" : "no-cors", cache: "no-store" });
          return !sameOrigin || res.ok;
        } catch {
          return false;
        }
      }),
    );
    available = ok;
    current = Math.max(0, ok.indexOf(true));
  });
</script>

<svelte:head>
  <title>{title} (original) · compare</title>
</svelte:head>

<iframe src={sources[current].src} {title}></iframe>

<div class="source">
  {#each sources as s, i}
    <button
      type="button"
      aria-pressed={i === current}
      disabled={available.length && !available[i]}
      title={available.length && !available[i] ? s.hint : ""}
      onclick={() => (current = i)}>{s.label}</button
    >
  {/each}
</div>

<style>
  iframe {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background: #17171d;
  }
  .source {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 100;
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.96);
    border: 2px solid #17171d;
    border-radius: 999px;
    box-shadow: 3px 3px 0 #17171d;
  }
  .source button {
    padding: 5px 10px;
    font: 600 12px var(--font);
    color: #17171d;
    background: none;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
  }
  .source button[aria-pressed="true"] {
    color: #fff;
    background: #ec3750;
  }
  .source button:disabled {
    opacity: 0.4;
    cursor: help;
  }
  @media (max-width: 1400px) {
    .source {
      bottom: 70px;
    }
  }
</style>
