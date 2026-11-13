import { writeFile, mkdir } from "node:fs/promises";

const API_URL = "https://clubapi.hackclub.com/clubs/map";
const OUT_FILE = new URL("../static/data/clubs.geojson", import.meta.url);

const round2 = (n) => Math.round(n * 100) / 100;

const res = await fetch(API_URL);
if (!res.ok) throw new Error(`ClubAPI returned ${res.status}`);
const records = await res.json();

const features = [];
let skippedNoCoords = 0;

for (const { id, fields } of records) {
  if (fields.club_status !== "Active") continue;

  const lat = parseFloat(fields.venue_lat_fuzz);
  const lng = parseFloat(fields.venue_lng_fuzz);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    skippedNoCoords++;
    continue;
  }

  features.push({
    type: "Feature",
    id,
    geometry: { type: "Point", coordinates: [round2(lng), round2(lat)] },
    properties: {
      name: fields.club_name,
      website: fields.club_website || null,
    },
  });
}

features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

const geojson = {
  type: "FeatureCollection",
  metadata: {
    source: API_URL,
    fetchedAt: new Date().toISOString(),
    totalFromApi: records.length,
    activeWithCoords: features.length,
    activeSkippedNoCoords: skippedNoCoords,
  },
  features,
};

await mkdir(new URL("../static/data/", import.meta.url), { recursive: true });
await writeFile(OUT_FILE, JSON.stringify(geojson, null, 2) + "\n");

console.log(`Saved ${features.length} active clubs (skipped ${skippedNoCoords} without coordinates).`);
