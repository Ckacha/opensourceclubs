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

}

function linkFor({ href, website }) {
  return href && href !== "null" ? href : website && website !== "null" ? website : null;
}

function hostOf(link) {
  try {
    return new URL(link.startsWith("http") ? link : `https://${link}`).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function clubHover(props) {
  const box = el("div", "club-popup hover");
  box.append(el("span", "tag", "Active club"), el("h3", null, props.name));
  const link = linkFor(props);
  if (link && !link.startsWith("/")) box.append(el("p", "meta", hostOf(link)));
  box.append(el("p", "hint", link ? "Click for link" : "Hack Club"));
  return box;
}

function clusterHover(count, leaves) {
  const box = el("div", "club-popup hover");
  box.append(el("span", "tag", `${count} clubs`));
  const list = el("ul", "names");
  for (const f of leaves) list.append(el("li", null, f.properties.name));
  box.append(list);
  if (count > leaves.length) box.append(el("p", "meta", `+${count - leaves.length} more`));
  box.append(el("p", "hint", "Click to zoom in"));
  return box;
}

export function addClubHover(map, Popup, cursor, onHover = () => {}) {
  const canvas = map.getCanvas();
  const hover = new Popup({ closeButton: false, closeOnClick: false, offset: 14, maxWidth: "240px", className: "club-hover" });
  let current = null;

  const hide = () => {   
    current = null;
    hover.remove();
  };

  map.on("mousemove", "club-point", (e) => {
    const f = e.features[0];
    canvas.style.cursor = cursor;
    onHover();
    const key = `p:${f.properties.name}`;
    if (current === key) return;
    current = key;
    hover.setLngLat(f.geometry.coordinates).setDOMContent(clubHover(f.properties)).addTo(map);
  });

  map.on("mousemove", "clusters", async (e) => {
    const f = e.features[0];
    canvas.style.cursor = cursor;
    onHover();
    const id = f.properties.cluster_id;
    const key = `c:${id}`;
    if (current === key) return;
    current = key;
    const leaves = await map.getSource("clubs").getClusterLeaves(id, 5, 0);
    if (current !== key) return;
    hover.setLngLat(f.geometry.coordinates).setDOMContent(clusterHover(f.properties.point_count, leaves)).addTo(map);
  });

  for (const layer of ["clusters", "club-point"]) {
    map.on("mouseleave", layer, () => {
      canvas.style.cursor = "";
      hide();
    });
  }
  map.on("mousedown", hide);
  map.on("movestart", (e) => e.originalEvent && hide());
  return hide;
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
