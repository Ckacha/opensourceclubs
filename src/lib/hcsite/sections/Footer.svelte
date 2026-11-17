<script>
  import { useT } from "../utils/i18n.js";
  import { href } from "../utils/links.js";
  import ThemeToggle from "../components/ThemeToggle.svelte";
  import iconPaths from "../data/icons.json";

  const t = useT("Footer");
  const year = new Date().getFullYear();

  const hcLinks = [
    [t("philosophy"), "/philosophy"],
    [t("teamBoard"), "/team"],
    [t("jobs"), "/jobs"],
    [t("branding"), "/brand"],
    [t("press"), "/press"],
    [t("donate"), "/philanthropy"],
    [t("imprint"), "/imprint"],
  ];
  const resLinks = [
    [t("programs"), "/programs"],
    [t("communityEvents"), "https://events.hackclub.com/"],
    [t("hackathons"), "https://hackathons.hackclub.com/"],
    [t("toolbox"), "https://toolbox.hackclub.com/"],
    [t("clubs"), "/clubs"],
    [t("hcb"), "/fiscal-sponsorship"],
    [t("conduct"), "/conduct"],
    [t("safeguarding"), "/safeguarding"],
    [t("privacy"), "/privacy-and-terms"],
  ];

  const icons = [
    { label: "GitHub", href: "https://github.com/hackclub" },
    { label: "YouTube", href: "https://www.youtube.com/c/HackClubHQ" },
    { label: "Instagram", href: "https://www.instagram.com/starthackclub" },
    { label: "Email", href: "mailto:team@hackclub.com" },
  ].map((i) => ({ ...i, paths: iconPaths[i.label] }));
  const ext = (h) => h.startsWith("http");
</script>

{#snippet col(title, links)}
  <div style:min-width={title === t("resources") ? "140px" : null}>
    <p class="heading">{title}</p>
    <ul>
      {#each links as [label, h]}
        <li>
          <a href={href(h)} class="footer-link" target={ext(h) ? "_blank" : null} rel={ext(h) ? "noopener noreferrer" : null}>{label}</a>
        </li>
      {/each}
    </ul>
  </div>
{/snippet}

<footer class="site-footer">
  <img src="/hcsite/assets/footer.webp" alt="" width="680" height="558" class="illus light" />
  <img src="/hcsite/assets/footer-dark.webp" alt="" width="680" height="558" class="illus dark" />

  <div class="top">
    <div class="brand">
      <div style="margin-bottom: 28px">
        <a href={href("/")}><img src="/hcsite/assets/hackClubFlag.svg" alt="Hack Club" width="200" height="70" /></a>
      </div>
      <p class="tag">{t("tagline")}</p>
      <a href={href("tel:18556254225")} aria-label={t("phoneLabel")} class="phone">{t("phone")}</a>
      <div class="socials">
        {#each icons as i}
          <a href={href(i.href)} target={ext(i.href) ? "_blank" : null} rel={ext(i.href) ? "noopener noreferrer" : null} aria-label={i.label} class="social">
            <svg viewBox="0 0 32 32" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" width="48" height="48" aria-hidden="true"
              >{#each i.paths as d}<path {d} />{/each}</svg
            >
          </a>
        {/each}
      </div>
    </div>
    <div class="cols">
      {@render col(t("hackClub"), hcLinks)}
      {@render col(t("resources"), resLinks)}
    </div>
  </div>

  <div class="bottom">
    <p class="legal">
      {t("copyright", { year })}
      <a href={href("https://the.hackfoundation.org/")} target="_blank" rel="noopener noreferrer">{t("hackFoundation")}</a>{t("nonprofit")}
      Open source at
      <a href="https://github.com/hackclub/site" target="_blank" rel="noopener noreferrer">hackclub/site</a>.
      This page is a mockup copied from it for the club globe proposal.
    </p>
    <ThemeToggle variant="footer" />
  </div>
</footer>

<style>
  .site-footer {
    background:
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      var(--footer-bg);
    background-size: 50px 50px;
    color: var(--paper);
    padding: 80px clamp(24px, 6vw, 80px) 60px;
    font-family: var(--font-phantom);
    position: relative;
  }
  .illus {
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-40.5%);
    width: clamp(340px, 48vw, 680px);
    height: auto;
    display: block;
    pointer-events: none;
    z-index: 2;
  }
  .illus.dark {
    display: none;
  }
  :global(.hcsite.dark) .illus.light {
    display: none;
  }
  :global(.hcsite.dark) .illus.dark {
    display: block;
  }
  .top {
    max-width: 1200px;
    margin: 0 auto 64px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 48px 64px;
  }
  .brand {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 280px;
  }
  .brand img {
    display: block;
    object-fit: contain;
  }
  .tag,
  .phone {
    font-weight: 400;
    font-size: 20px;
    color: var(--paper);
    margin: 0 0 8px;
    line-height: 1.2;
  }
  .phone {
    margin-bottom: 32px;
    text-decoration: none;
    display: inline-block;
  }
  .socials {
    display: flex;
    gap: 12px;
  }
  .social {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 8px;
    flex-shrink: 0;
    color: var(--paper);
    transition: opacity 0.15s;
  }
  .cols {
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
  }
  .heading {
    font-weight: 700;
    font-size: 20px;
    color: var(--paper);
    margin: 0 0 16px;
    line-height: 1.2;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .footer-link {
    font-weight: 400;
    font-size: 16px;
    color: var(--paper);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.15s;
    display: inline-block;
  }
  .footer-link:hover,
  .footer-link:focus-visible,
  .social:hover {
    opacity: 1;
  }
  .bottom {
    padding-top: 32px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .legal {
    font-weight: 400;
    font-size: 16px;
    color: var(--paper);
    opacity: 0.8;
    margin: 0;
    line-height: 1.5;
    max-width: 820px;
  }
  .legal a {
    color: var(--paper);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  @media (max-width: 767px) {
    .site-footer {
      padding-top: 120px;
    }
    .illus {
      width: min(320px, 72vw);
      transform: translateY(-40%);
    }
  }
</style>
