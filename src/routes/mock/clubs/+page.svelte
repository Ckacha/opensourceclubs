<script>
  import ClubGlobe from "../../../lib/globe/ClubGlobe.svelte";
  let { data } = $props();
  const count = $derived(data.clubs.features.length);

  const marquee = [
    "BUILD COOL STUFF",
    "GET FREE REWARDS",
    "DRINK BOBA",
    "CODE TOGETHER",
    "HAVE FUN WITH FRIENDS",
    "LEARN NEW CONCEPTS",
    "DID I HEAR FREE STICKERS?",
  ];
  const perks = [
    ["yellow", "Club Starter", "Create promotional materials for your club. Get up to $100 in funding!", "Explore Club Starter"],
    ["purple", "Club Shop", "Stickers, shirts, Raspberry Pis, and more to help your club thrive.", "Visit the shop"],
    ["blue", "Spaces", "All-in-one web IDE to create, host and collaborate in with over 500 supported languages and a variety of templates to use.", "Explore Spaces"],
  ];
  const learn = [
    ["Starting a new club", "Start a new Hack Club!"],
    ["Converting an existing club", "Turn your existing club into a Hack Club!"],
    ["The Teacher Zone", "Ways to support a Hack Club at your school!"],
    ["School toolbox", "Resources for starting a Hack Club at your school!"],
  ];
</script>

<svelte:head>
  <title>clubs.hackclub.com mockup · club globe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
</svelte:head>

<div class="cl">
  <nav class="top">
    <a href="/mock/clubs" class="logo"
      ><img src="https://assets.hackclub.com/flag-orpheus-top.svg" alt="Hack Club" width="120" /></a
    >
    <div class="group">
      {#each ["Shop", "Workshops", "Explore", "Resources", "Help"] as l}<a href="#perks">{l}</a>{/each}
    </div>
    <div class="right">
      <a href="#perks" class="signin">Sign In</a>
      <a href="#perks" class="pill red">Apply</a>
    </div>
  </nav>

  <ClubGlobe clubs={data.clubs} variant="hero" intro="session" zoom={2.35} center={[-50, 28]} class="horizon">
    <div class="hero-copy">
      <h1>Don't run your coding club alone.<br />Make it a <span class="grad">Hack Club</span>.</h1>
      <p>
        A worldwide network of high school coding clubs. Make cool things, find people who share your interests, and
        get help from a community of hackers!
      </p>
      <div class="ctas">
        <a class="pill red" href="#perks">Start a club →</a>
        <a class="pill outline" href="#perks">Sign in</a>
        <a class="more" href="/explore/map">See all {count} clubs →</a>
      </div>
    </div>
  </ClubGlobe>

  <div class="marquee" aria-hidden="true">
    <div class="track">
      {#each [0, 1] as _}
        {#each marquee as m}<span>{m}</span><span class="star">✦</span>{/each}
      {/each}
    </div>
  </div>

  <section class="perks" id="perks">
    <h2>Perks we offer your club.<br /><span class="free">For free!</span></h2>
    <div class="grid">
      {#each perks as [color, icon, title, text, cta]}
        <article class="perk {color}">
          <span class="icon">{icon}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <a class="pill red" href="#perks">{cta} →</a>
        </article>
      {/each}
    </div>
  </section>

  <section class="learn">
    <h2>Learn more about:</h2>
    <div class="grid four">
      {#each learn as [title, text]}
        <a class="tile" href="#perks"><h3>{title}</h3><p>{text}</p><span>Learn more →</span></a>
      {/each}
    </div>
  </section>

  <footer>For teens, by teens. · Mockup for the club globe proposal, not the real site.</footer>
</div>

<style>
  .cl {
    --cream: #fdf6e8;
    --serif: "Gloock", Georgia, serif;
    min-height: 100vh;
    color: #fff;
    background: #17171d;
    padding-bottom: 80px;
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 20px 56px;
  }
  .logo img {
    display: block;
  }
  .group {
    display: flex;
    gap: 4px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    backdrop-filter: blur(6px);
  }
  .group a {
    padding: 6px 14px;
    color: #ddd;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
  }
  .signin {
    color: #fff;
    font-weight: 700;
    text-decoration: none;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    font: 700 17px var(--font);
    border-radius: 12px;
    text-decoration: none;
    white-space: nowrap;
  }
  .pill.red {
    color: #fff;
    background: var(--red);
  }
  .pill.outline {
    color: #fff;
    border: 3px solid #fff;
    border-radius: 999px;
    padding: 9px 24px;
  }
  .top .pill.red {
    padding: 9px 20px;
    border-radius: 999px;
  }

  .cl :global(.stage.horizon) {
    height: 100vh;
    min-height: 640px;
  }
  .cl :global(.stage.horizon .map) {
    left: 0 !important;
    right: 0 !important;
    top: 42% !important;
    bottom: -62% !important;
  }
  .hero-copy {
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    padding: 0 24px;
    text-align: center;
    pointer-events: none;
  }
  .hero-copy a {
    pointer-events: auto;
  }
  h1 {
    margin: 0 0 14px;
    font: 400 clamp(38px, 5.6vw, 76px) / 1.02 var(--serif);
    color: var(--cream);
    text-shadow: 0 2px 24px rgba(13, 13, 20, 0.8);
  }
  .grad {
    background: linear-gradient(90deg, #a633d6, #ec3750, #ff8c37, #f1c40f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hero-copy p {
    max-width: 620px;
    margin: 0 auto 22px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.35;
  }
  .ctas {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  .more {
    color: #fff;
    font-weight: 700;
  }

  .marquee {
    overflow: hidden;
    background: var(--red);
    padding: 14px 0;
  }
  .track {
    display: flex;
    gap: 34px;
    width: max-content;
    font-size: 22px;
    font-weight: 800;
    animation: scroll 40s linear infinite;
  }
  @keyframes scroll {
    to {
      transform: translateX(-50%);
    }
  }

  section {
    max-width: 1140px;
    margin: 0 auto;
    padding: 70px 24px 10px;
  }
  h2 {
    margin: 0 0 28px;
    font: 400 clamp(36px, 5vw, 60px) / 1.05 var(--serif);
    color: var(--cream);
  }
  .free {
    color: var(--yellow);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .grid.four {
    grid-template-columns: repeat(4, 1fr);
  }
  .perk {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 340px;
    padding: 26px;
    border-radius: 16px;
  }
  .perk.yellow {
    color: var(--dark);
    background: #fecf3d;
  }
  .perk.purple {
    background: #7432b9;
  }
  .perk.blue {
    background: #338eda;
  }
  .icon {
    font-size: 34px;
  }
  .perk h3,
  .tile h3 {
    margin: 12px 0 8px;
    font: 400 32px/1.1 var(--serif);
  }
  .perk p {
    margin: 0 0 20px;
    font-size: 16px;
    font-weight: 600;
  }
  .perk .pill {
    margin-top: auto;
    border-radius: 999px;
    font-size: 16px;
  }
  .tile {
    padding: 22px;
    color: #fff;
    background: #24242d;
    border-radius: 16px;
    text-decoration: none;
  }
  .tile h3 {
    font-size: 24px;
  }
  .tile p {
    color: #c4c4cf;
  }
  .tile span {
    color: var(--red);
    font-weight: 700;
  }
  footer {
    padding: 50px 20px;
    text-align: center;
    color: var(--muted);
    font-size: 14px;
  }

  @media (max-width: 900px) {
    .group {
      display: none;
    }
    .top {
      padding: 16px 20px;
    }
    .grid,
    .grid.four {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 760px) {
    .cl :global(.stage.horizon .map) {
      top: 50% !important;
      bottom: -40% !important;
    }
    .hero-copy p {
      font-size: 17px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
  }
</style>
