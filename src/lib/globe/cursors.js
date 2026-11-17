const svg = (body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>${body}</svg>`)}") 14 14`;
const ring = (r, fill, stroke) =>
  `<circle cx='14' cy='14' r='${r}' fill='${fill}' stroke='#fff' stroke-width='5'/>` +
  `<circle cx='14' cy='14' r='${r}' fill='${fill}' stroke='${stroke}' stroke-width='2.5'/>`;
const dot = (r, fill) => `<circle cx='14' cy='14' r='${r}' fill='${fill}' stroke='#fff' stroke-width='1.5'/>`;

export const cursors = {
  grab: `${svg(ring(9, "rgba(236,55,80,0.15)", "#17171d") + dot(2.5, "#ec3750"))}, grab`,
  grabbing: `${svg(ring(6, "rgba(236,55,80,0.35)", "#17171d") + dot(2.5, "#ec3750"))}, grabbing`,
  pointer: `${svg(ring(10, "rgba(236,55,80,0.25)", "#ec3750") + dot(3, "#17171d"))}, pointer`,
};
