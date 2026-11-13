export const prerender = true;

export async function load({ fetch }) {
  const res = await fetch("/data/clubs.geojson");
  return { clubs: await res.json() };
}
