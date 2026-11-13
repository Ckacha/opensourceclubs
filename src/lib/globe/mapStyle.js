export const brand = {
  red: "#ec3750",
  orange: "#ff8c37",
  yellow: "#f1c40f",
  green: "#33d6a6",
  cyan: "#5bc0de",
  blue: "#338eda",
  purple: "#a633d6",
  muted: "#8492a6",
  dark: "#17171d",
  white: "#ffffff",
};

const z = (...stops) => ["interpolate", ["linear"], ["zoom"], ...stops];
const name = ["coalesce", ["get", "name:en"], ["get", "name_en"], ["get", "name"]];

export const mapStyle = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  projection: { type: "globe" },
  layers: [

    {
      id: "land",
      type: "background",
      paint: { "background-color": z(4, brand.red, 7, "#fbd5dc", 11, "#fdeef0") },
    },
    {
      id: "park",
      type: "fill",
      source: "omt",
      "source-layer": "park",
      minzoom: 9,
      paint: { "fill-color": brand.green, "fill-opacity": z(9, 0, 11, 0.18) },
    },
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      paint: { "fill-color": z(5, brand.white, 9, "#eaf6fb") },
    },
    {
      id: "waterway",
      type: "line",
      source: "omt",
      "source-layer": "waterway",
      minzoom: 9,
      paint: { "line-color": "#eaf6fb", "line-width": z(9, 0.5, 15, 3) },
    },
    {
      id: "building",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 14,
      paint: { "fill-color": "#f6c2cc", "fill-opacity": z(14, 0, 15, 1) },
    },

    {
      id: "road-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 11,
      filter: ["in", ["get", "class"], ["literal", ["tertiary", "minor", "service"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": brand.white, "line-width": z(11, 0.5, 16, 8) },
    },
    {
      id: "road-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 6,
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]],
      layout: { "line-cap": "round", "line-join": "round" },

      paint: {
        "line-color": z(6, "#fbd5dc", 8, "#f38a9b"),
        "line-width": z(6, 0.5, 16, 10),
      },
    },

    {
      id: "border-state",
      type: "line",
      source: "omt",
      "source-layer": "boundary",
      minzoom: 4,
      filter: ["all", ["==", ["get", "admin_level"], 4], ["!=", ["get", "maritime"], 1]],
      paint: {
        "line-color": z(5, "rgba(255,255,255,0.5)", 7, "rgba(236,55,80,0.35)"),
        "line-dasharray": [2, 2],
        "line-width": 1,
      },
    },
    {
      id: "border-country",
      type: "line",
      source: "omt",
      "source-layer": "boundary",
      minzoom: 2,
      filter: ["all", ["==", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
      paint: {
        "line-color": z(5, "rgba(255,255,255,0.75)", 7, "rgba(236,55,80,0.6)"),
        "line-width": z(2, 0.6, 8, 1.8),
      },
    },

    {
      id: "label-country",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      minzoom: 3,
      maxzoom: 7,
      filter: ["==", ["get", "class"], "country"],
      layout: {
        "text-field": name,
        "text-font": ["Noto Sans Bold"],
        "text-size": z(3, 10, 6, 14),
        "text-transform": "uppercase",
        "text-letter-spacing": 0.12,
      },
      paint: { "text-color": z(5, brand.white, 6.5, brand.dark) },
    },
    {
      id: "label-city",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      minzoom: 6,
      filter: ["in", ["get", "class"], ["literal", ["city", "town"]]],
      layout: {
        "text-field": name,
        "text-font": ["Noto Sans Bold"],
        "text-size": z(6, 11, 12, 16),
      },
      paint: {
        "text-color": brand.dark,
        "text-halo-color": brand.white,
        "text-halo-width": 1.5,
      },
    },
    {
      id: "label-road",
      type: "symbol",
      source: "omt",
      "source-layer": "transportation_name",
      minzoom: 14,

      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary", "minor"]]],
      layout: {
        "symbol-placement": "line",
        "text-field": name,
        "text-font": ["Noto Sans Regular"],
        "text-size": 11,
      },
      paint: {
        "text-color": brand.muted,
        "text-halo-color": brand.white,
        "text-halo-width": 1.5,
      },
    },
  ],
};
