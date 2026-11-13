<script>
  import ClubGlobe from "../lib/globe/ClubGlobe.svelte";
  let { data } = $props();
  const count = $derived(data.clubs.features.length);
</script>

<svelte:head>
  <title>Hack Club Clubs</title>
</svelte:head>

<ClubGlobe clubs={data.clubs} variant="hero" intro="once" zoom={2.05} class="home">
  <section class="hero-copy">
    <p class="eyebrow">{count} active clubs worldwide</p>
    <h1>Don't run your coding club alone. Make it a <span>Hack Club</span>.</h1>
    <p class="lede">
      A worldwide network of high school coding clubs. Make cool things, find people who share your interests, and
      get help from a community of hackers!
    </p>
    <div class="ctas">
      <a class="btn primary" href="https://apply.hackclub.com" target="_blank" rel="noreferrer">Start a club</a>
      <a class="btn" href="/explore/map">Explore the map →</a>
    </div>
  </section>
</ClubGlobe>

<style>
  :global(.stage.hero) {
    height: 100vh;
    min-height: 560px;
  }

  :global(.stage.hero.home .map) {
    left: 34% !important;
  }
  @media (max-width: 760px) {
    :global(.stage.hero.home .map) {
      left: 0 !important;
      top: 40% !important;
    }
  }

  .hero-copy {
    position: absolute;
    left: clamp(16px, 6vw, 96px);
    top: 50%;
    transform: translateY(-50%);
    max-width: min(460px, 36%);
    color: #fff;
  }

  .eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--yellow);
  }

  h1 {
    margin: 0;
    font-size: clamp(32px, 4.6vw, 60px);
    line-height: 1.05;
  }

  h1 span {
    color: var(--red);
  }

  .lede {
    margin: 18px 0 26px;
    font-size: 17px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }

  .ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .btn {
    padding: 12px 20px;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    border: 2px solid #fff;
    border-radius: 999px;
  }

  .btn.primary {
    background: var(--red);
    border-color: var(--red);
  }

  @media (max-width: 760px) {
    .hero-copy {
      top: 84px;
      transform: none;
      max-width: none;
      right: 16px;
    }

    .lede {
      display: none;
    }
  }
</style>
