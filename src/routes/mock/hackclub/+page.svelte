<script>
  import { onMount } from "svelte";
  import "../../../lib/hcsite/styles/site.css";
  import { theme, initTheme } from "../../../lib/hcsite/utils/theme.svelte.js";
  import Navbar from "../../../lib/hcsite/sections/Navbar.svelte";
  import Hero from "../../../lib/hcsite/sections/Hero.svelte";
  import Joining from "../../../lib/hcsite/sections/Joining.svelte";
  import Footer from "../../../lib/hcsite/sections/Footer.svelte";

  let { data } = $props();

  onMount(initTheme);
</script>

<svelte:head>
  <title>hackclub.com mockup · club globe</title>
</svelte:head>

<div class="hcsite" class:dark={theme.dark}>
  <Navbar />
  <main id="main" tabindex="-1">
    <Hero />
    <Joining clubs={data.clubs} />
  </main>
  <Footer />
</div>
