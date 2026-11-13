<script>
  import ClubGlobe from "../../../lib/globe/ClubGlobe.svelte";
  let { data } = $props();
  const count = $derived(data.clubs.features.length);
</script>

<svelte:head>
  <title>Club map · Hack Club</title>
</svelte:head>

<ClubGlobe clubs={data.clubs} variant="full" intro="session">
  <div class="panel">
    <p class="eyebrow">Hack Club</p>
    <h1>Clubs around the world</h1>
    <p class="stat"><span>{count}</span> active clubs</p>
    <ul class="legend">
      <li><span class="dot cluster"></span>Group of clubs, click to zoom</li>
      <li><span class="dot club"></span>Single club, click for info</li>
    </ul>
  </div>
</ClubGlobe>

<style>
  :global(.stage.full) {
    height: 100vh;
    background-color: var(--paper) !important;
    background-image: radial-gradient(rgba(132, 146, 166, 0.35) 1px, transparent 1px) !important;
    background-size: 22px 22px !important;
  }

  .panel {
    position: absolute;
    left: 16px;
    bottom: 16px;
    max-width: 280px;
    padding: 16px 18px;
    background: #fff;
    border: 2px solid var(--dark);
    border-radius: 14px;
    box-shadow: 4px 4px 0 var(--dark);
  }

  .eyebrow {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--red);
  }

  h1 {
    margin: 2px 0 8px;
    font-size: 22px;
    line-height: 1.15;
  }

  .stat {
    margin: 0 0 10px;
    font-size: 14px;
    color: var(--muted);
  }

  .stat span {
    font-size: 28px;
    font-weight: 800;
    color: var(--red);
    margin-right: 4px;
  }

  .legend {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 13px;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .dot {
    display: inline-block;
    border: 2px solid var(--dark);
    border-radius: 50%;
  }

  .dot.cluster {
    width: 14px;
    height: 14px;
    background: #fff;
  }

  .dot.club {
    width: 10px;
    height: 10px;
    background: var(--yellow);
  }

  @media (max-width: 600px) {
    .panel {
      right: 16px;
      max-width: none;
    }
  }
</style>
