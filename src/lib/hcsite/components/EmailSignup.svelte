<script>
  import { useT } from "../utils/i18n.js";

  let { variant = "hero" } = $props();
  const tc = useT("Common");

  const cfg = {
    hero: { w: "min(560px, calc(100vw - 48px))", btnW: "clamp(96px, 20vw, 110px)", btnH: "clamp(38px, 10vw, 42px)" },
    video: { w: "100%", btnW: "clamp(90px, 27vw, 108px)", btnH: "clamp(38px, 10vw, 42px)" },
    ready: { w: "min(616px, calc(100vw - 48px))", btnW: "100px", btnH: "40px" },
  };

  let email = $state("");
  let err = $state(false);
  let focused = $state(false);
  let hover = $state(false);

  const c = $derived(cfg[variant]);
  const isVideo = $derived(variant === "video");
  const isReady = $derived(variant === "ready");
  const shadow = $derived(
    err ? "0 0 0 2px var(--red)" : isReady && focused ? "0 0 0 3px rgba(236,55,80,0.25)" : "none",
  );
  const padR = $derived(isVideo ? "clamp(98px, 30vw, 130px)" : isReady ? "160px" : "clamp(108px, 25vw, 140px)");
  const fontSize = $derived(isVideo ? "clamp(16px, 4.8vw, 20px)" : "20px");

  function valid(value) {
    const s = value.trim();
    if (!s || s.length > 254) return false;
    const at = s.indexOf("@");
    if (at < 1 || at !== s.lastIndexOf("@")) return false;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1);
    if (local.length > 64 || !domain) return false;
    const dot = domain.lastIndexOf(".");
    if (dot < 1 || dot >= domain.length - 1) return false;
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code <= 32 || code === 127) return false;
    }
    return true;
  }

  function submit() {
    if (!valid(email)) {
      err = true;
      return;
    }
    // Demo only: the real site sends you to Slack here. This one just accepts the email and stops.
    err = false;
  }
</script>

<div class="wrap">
  <div
    class="field"
    style="width: {c.w}; box-shadow: {shadow}"
  >
    <input
      type="email"
      aria-label={tc("emailAddress")}
      placeholder="orpheus@example.com"
      bind:value={email}
      oninput={() => (err = false)}
      onkeydown={(e) => e.key === "Enter" && submit()}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      style="padding-left: {isVideo ? 'clamp(16px, 4.5vw, 22px)' : '24px'}; padding-right: {padR}; font-size: {fontSize}"
    />
    <button
      type="button"
      onclick={submit}
      onmouseenter={() => (hover = true)}
      onmouseleave={() => (hover = false)}
      style="width: {c.btnW}; height: {c.btnH}; font-size: {fontSize}; background: {hover
        ? 'var(--red)'
        : 'var(--foreground)'}; color: {hover ? 'var(--paper)' : 'var(--background)'}"
    >
      {tc("join")}
    </button>
  </div>

  {#if err}
    <div class="error">
      {tc("invalidEmail")}
      <div class="tip"></div>
    </div>
  {/if}
</div>

<style>
  .wrap {
    position: relative;
    display: inline-block;
  }
  .field {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--surface-hover);
    border-radius: 9999px;
    height: clamp(48px, 12vw, 52px);
    transition: box-shadow 0.2s ease;
  }

  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-phantom);
    color: var(--foreground);
  }
  input::placeholder {
    opacity: 0.5;
  }

  button {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    border: none;
    border-radius: 9999px;
    font-family: var(--font-phantom);
    font-weight: normal;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background 0.4s ease,
      color 0.4s ease;
  }
  .error {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--red);
    color: var(--paper);
    padding: 8px 16px;
    border-radius: 6px;
    font-family: var(--font-phantom);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    animation: fadeIn 0.2s ease;
    box-shadow: 0 4px 12px rgba(236, 55, 80, 0.3);
  }
  .tip {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--red);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
