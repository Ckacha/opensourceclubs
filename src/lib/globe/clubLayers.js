import { brand } from "./mapStyle.js";

export function addClubLayers(map, clubs) {
  map.addSource("clubs", {
    type: "geojson",
    data: clubs,
    cluster: true,
    clusterRadius: 18,
    clusterMaxZoom: 12,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "clubs",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": brand.white,
      "circle-radius": ["step", ["get", "point_count"], 10, 10, 14, 30, 18],
      "circle-stroke-width": 2,
      "circle-stroke-color": brand.dark,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "clubs",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
    },
    paint: { "text-color": brand.red },
  });

  map.addLayer({
    id: "club-point",
    type: "circle",
    source: "clubs",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": brand.yellow,
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 5, 12, 8],
      "circle-stroke-width": 2,
      "circle-stroke-color": brand.dark,
    },
  });

  map.addLayer({
    id: "club-label",
    type: "symbol",
    source: "clubs",
    filter: ["!", ["has", "point_count"]],
    minzoom: 8,
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
      "text-offset": [0, 1.3],
      "text-anchor": "top",
    },
    paint: {
      "text-color": brand.dark,
      "text-halo-color": brand.white,
      "text-halo-width": 2,
    },
  });

  for (const layer of ["clusters", "club-point"]) {
    map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
  }
}

export function clubPopup({ name, href, website }) {
  const el = document.createElement("div");
  el.className = "club-popup";
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = "Active club";
  const title = document.createElement("h3");
  title.textContent = name;
  el.append(tag, title);

  const link = href && href !== "null" ? href : website && website !== "null" ? website : null;
  if (link) {
    const a = document.createElement("a");
    const external = !link.startsWith("/");
    a.href = external && !link.startsWith("http") ? `https://${link}` : link;
    a.textContent = href && href !== "null" ? "Open profile →" : "Visit website →";
    if (external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    el.appendChild(a);
  }
  return el;
}
