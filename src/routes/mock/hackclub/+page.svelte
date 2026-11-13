<script>
  import ClubGlobe from "../../../lib/globe/ClubGlobe.svelte";
  let { data } = $props();
  const count = $derived(data.clubs.features.length);

  const links = ["About", "Programs", "Clubs", "HCB", "Hackathons", "Resources", "Donate"];
</script>

<svelte:head>
  <title>hackclub.com mockup · club globe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
</svelte:head>

<div class="hc">
  <nav class="top">
    <a href="/mock/hackclub" class="logo"
      ><img src="https://assets.hackclub.com/flag-orpheus-top.svg" alt="Hack Club" width="140" /></a
    >
    <div class="links">
      {#each links as l}<a href={l === "Clubs" ? "/mock/clubs" : "#"}>{l}</a>{/each}
    </div>
    <a class="pill cream" href="#join">Join the community</a>
  </nav>

  <header class="hero">
    <a class="banner" href="#join">✨ Check out Stardance, the largest free STEM event of the fall →</a>
    <h1>Where <span class="grad">teens</span><br />make cool stuff.</h1>
    <p class="lede">Hack Club is the world's largest nonprofit movement of teenagers making cool projects.</p>
    <form class="signup" onsubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="orpheus@example.com" aria-label="Email" />
      <button class="pill cream" type="submit">Join!</button>
    </form>
    <p class="terms">For all teens aged 13 to 18. By continuing, you agree to our <a href="#join">terms</a>.</p>
  </header>

  <section class="joining" id="join">
    <h2>Everything that comes with joining.</h2>
    <p class="sub">Hack Club isn't just events. Here's what you get as part of the community.</p>

    <article class="card community">
      <h3>💬 Our online community</h3>
      <p>
        Chat, collaborate, and hang out with tens of thousands of teen makers from around the world. Find people
        working on the same weird projects as you, get help when you're stuck, or just #lounge.
      </p>
      <a class="pill red" href="#join">Join the Slack →</a>
    </article>

    <article class="card hcb">
      <h3>🏦 HCB: run a nonprofit</h3>
      <p>
        Got an idea for a hackathon, club, or event? HCB gives your team the financial tools to accept donations,
        manage money, and operate under a real 501(c)(3) umbrella, with no paperwork nightmare.
      </p>
      <a class="pill red" href="#join">Start fundraising →</a>
    </article>

    <article class="card globe-card">
      <ClubGlobe clubs={data.clubs} variant="hero" intro="always" class="in-card">
        <div class="club-copy">
          <h3>
            <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true"
              ><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="2" /><path
                d="M11 24V8m0 1c4-2 6 2 10 0v8c-4 2-6-2-10 0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              /></svg
            >
            1,500+ in-person clubs
          </h3>
          <p>
            There are Hack Clubs at high schools all over the world. Each one is a place where you build real projects
            from day one. No boring lectures, no prerequisites.
          </p>
          <p class="live"><span class="ping"></span>{count} active clubs on the map right now</p>
          <div class="ctas">
            <a class="pill red" href="/mock/clubs">Start or find a club →</a>
            <a class="ghost" href="/explore/map">Explore the globe</a>
          </div>
        </div>
      </ClubGlobe>
    </article>

    <article class="card perks">
      <h3>🪄 Free stuff, just for joining</h3>
      <p>
        GitHub Education, Brilliant Premium, and a bunch more, all unlocked just by being part of Hack Club. No catch,
        no cost.
      </p>
      <a class="pill red" href="#join">See all perks →</a>
    </article>
  </section>

  <section class="ready">
    <h2>Ready?</h2>
    <p>Get started with building something real.</p>
    <a class="pill cream" href="#join">Join!</a>
  </section>

  <footer>For teens, by teens. · Mockup for the club globe proposal, not the real site.</footer>
</div>

<style>
  .hc {
    --bg: #1f1f27;
    --cream: #fdf6e8;
    --serif: "Gloock", Georgia, serif;
    min-height: 100vh;
    color: #fff;
    background: var(--bg);
    padding-bottom: 80px;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: 1240px;
    margin: 0 auto;
    padding: 18px 24px;
  }
  .logo img {
    display: block;
  }
  .links {
    display: flex;
    gap: 22px;
    margin-left: auto;
    font-size: 17px;
    font-weight: 600;
  }
  .links a {
    color: #fff;
    text-decoration: none;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    padding: 11px 22px;
    font: 600 16px var(--font);
    border: 0;
    border-radius: 999px;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
  }
  .pill.cream {
    color: var(--dark);
    background: var(--cream);
  }
  .pill.red {
    color: #fff;
    background: var(--red);
  }

  .hero {
    padding: 36px 24px 110px;
    text-align: center;
    background: linear-gradient(180deg, #1f181f 0%, #2a1a22 55%, #6d2232 100%);
  }
  .banner {
    color: #ddd;
    text-decoration: none;
    font-size: 18px;
  }
  h1 {
    margin: 18px 0 14px;
    font: 400 clamp(52px, 9vw, 104px) / 0.98 var(--serif);
    color: var(--cream);
  }
  .grad {
    background: linear-gradient(90deg, #a633d6, #ec3750, #ff8c37, #f1c40f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .lede {
    max-width: 560px;
    margin: 0 auto 26px;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.35;
  }
  .signup {
    display: flex;
    max-width: 560px;
    margin: 0 auto;
    padding: 5px;
    background: #2b2a33;
    border-radius: 999px;
  }
  .signup input {
    flex: 1;
    min-width: 0;
    padding: 0 20px;
    font: 17px var(--font);
    color: #fff;
    background: none;
    border: 0;
    outline: none;
  }
  .terms {
    display: inline-block;
    margin: 14px 0 0;
    padding: 8px 16px;
    font-size: 14px;
    font-style: italic;
    background: #1b1a21;
    border-radius: 999px;
  }
  .terms a {
    color: var(--red);
  }

  .joining {
    max-width: 920px;
    margin: 0 auto;
    padding: 80px 20px 20px;
  }
  h2 {
    margin: 0 0 8px;
    font: 400 clamp(34px, 5vw, 48px) / 1.1 var(--serif);
    text-align: center;
  }
  .sub {
    margin: 0 0 36px;
    text-align: center;
    color: #cfcfd8;
    font-size: 18px;
  }
  .card {
    position: relative;
    margin-bottom: 30px;
    padding: 34px 44px;
    border-radius: 14px;
    overflow: hidden;
  }
  .card h3 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 12px;
    font: 400 clamp(28px, 4vw, 40px) / 1.1 var(--serif);
  }
  .card p {
    max-width: 640px;
    margin: 0 0 18px;
    font-size: 18px;
    line-height: 1.4;
  }
  .community {
    background: linear-gradient(120deg, #3b2a5e, #23222c 70%);
  }
  .hcb {
    background: linear-gradient(120deg, #4a1d29, #23222c 70%);
  }
  .perks {
    background: linear-gradient(120deg, #4b3a12, #23222c 70%);
  }

  .globe-card {
    padding: 0;
    outline: 2px solid rgba(236, 55, 80, 0.55);
    outline-offset: -2px;
  }
  .globe-card :global(.stage.in-card) {
    height: 520px;
  }
  .hc :global(.in-card .map) {
    left: 50% !important;
  }
  .club-copy {
    position: absolute;
    top: 50%;
    left: 44px;
    width: 46%;
    transform: translateY(-50%);
  }
  .club-copy p {
    font-size: 17px;
  }
  .live {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    color: var(--yellow);
  }
  .ping {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--yellow);
    box-shadow: 0 0 0 0 rgba(241, 196, 15, 0.6);
    animation: ping 1.8s infinite;
  }
  @keyframes ping {
    70% {
      box-shadow: 0 0 0 10px rgba(241, 196, 15, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(241, 196, 15, 0);
    }
  }
  .ctas {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18px;
  }
  .ghost {
    color: #fff;
    font-weight: 700;
  }

  .ready {
    padding: 60px 20px 20px;
    text-align: center;
  }
  .ready p {
    color: #cfcfd8;
    font-size: 18px;
  }
  footer {
    padding: 40px 20px;
    text-align: center;
    color: var(--muted);
    font-size: 14px;
  }

  @media (max-width: 900px) {
    .links {
      display: none;
    }
    .top {
      justify-content: space-between;
    }
  }
  @media (max-width: 760px) {
    .card {
      padding: 26px 22px;
    }
    .globe-card :global(.stage.in-card) {
      height: 720px;
    }
    .club-copy {
      top: 26px;
      left: 22px;
      right: 22px;
      width: auto;
      transform: none;
    }
    .hc :global(.in-card .map) {
      left: 0 !important;
      top: 52% !important;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ping {
      animation: none;
    }
  }
</style>
