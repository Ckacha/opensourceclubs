const KEY = "hc-site-theme";

export const theme = $state({ mode: "system", dark: false });

function apply() {
  const sys = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
  theme.dark = theme.mode === "dark" || (theme.mode === "system" && sys);
}

export function initTheme() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") theme.mode = v;
  } catch {}
  apply();
  const mql = matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", apply);
  return () => mql.removeEventListener("change", apply);
}

export function cycleTheme() {
  theme.mode = theme.mode === "light" ? "system" : theme.mode === "system" ? "dark" : "light";
  try {
    localStorage.setItem(KEY, theme.mode);
  } catch {}
  apply();
}
