const map = L.map("map").setView([40.0, -105.0], 8);

// Base layers
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 21,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 21,
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a> World Imagery',
  },
);

const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution:
    '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
});

// OpenSnowMap pistes = transparent overlay (ski runs only); use on top of a base
const openSnowMapPistes = L.tileLayer(
  "https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.opensnowmap.org">OpenSnowMap</a>',
  },
);

// OpenRailwayMap – railways overlay
const openRailwayMap = L.tileLayer(
  "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://openrailwaymap.org">OpenRailwayMap</a>',
  },
);

// NOAA NOHRSC Snow Analysis (US only) – WMS (opacity from CSS variable)
const snowOverlayOpacity =
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--snow-overlay-opacity",
    ),
  ) || 0.6;

const noaaNohrscWmsBase =
  "https://mapservices.weather.noaa.gov/raster/services/snow/NOHRSC_Snow_Analysis/MapServer/WMSServer?";

const nohrscSnowDepth = L.tileLayer.wms(noaaNohrscWmsBase, {
  layers: "0",
  format: "image/png",
  transparent: true,
  opacity: snowOverlayOpacity,
  attribution:
    '&copy; <a href="https://www.noaa.gov">NOAA</a> NOHRSC Snow Analysis',
});

const nohrscSnowWaterEquivalent = L.tileLayer.wms(noaaNohrscWmsBase, {
  layers: "4",
  format: "image/png",
  transparent: true,
  opacity: snowOverlayOpacity,
  attribution:
    '&copy; <a href="https://www.noaa.gov">NOAA</a> NOHRSC Snow Analysis',
});

// Add default layer
osm.addTo(map);

// Base layers (only one active at a time)
const baseLayers = {
  "Streets (OpenStreetMap)": osm,
  "Satellite (Esri World Imagery)": satellite,
  "Topographic (OpenTopoMap)": topo,
};

// Overlays (can be toggled on top of any base)
const overlays = {
  "Railways (OpenRailwayMap)": openRailwayMap,
  "Ski Slopes (OpenSnowMap)": openSnowMapPistes,
  "Snow Depth (NOAA)": nohrscSnowDepth,
  "Snow Water Equivalent (NOAA)": nohrscSnowWaterEquivalent,
};

L.control.layers(baseLayers, overlays, { position: "topleft" }).addTo(map);

// Legend control – only visible when a layer with a legend (NOAA) is on
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "leaflet-legend leaflet-control");
  div.innerHTML = "<strong>Legend</strong>";
  return div;
};

let legendOnMap = false;

function updateLegend() {
  const hasDepth = map.hasLayer(nohrscSnowDepth);
  const hasSwe = map.hasLayer(nohrscSnowWaterEquivalent);
  const showLegend = hasDepth || hasSwe;

  if (!showLegend) {
    if (legendOnMap) {
      map.removeControl(legend);
      legendOnMap = false;
    }
    return;
  }

  if (!legendOnMap) {
    legend.addTo(map);
    legendOnMap = true;
  }

  const container = legend.getContainer();
  if (!container) return;

  let html = "";
  if (hasDepth) {
    const depthRanges = [
      ["#e0f3f8", "0–0.39"],
      ["#abd9e9", "0.39–2"],
      ["#74add1", "2–3.9"],
      ["#4575b4", "3.9–9.8"],
      ["#313695", "9.8–20"],
      ["#fee090", "20–39"],
      ["#fdae61", "39–59"],
      ["#f46d43", "59–98"],
      ["#d73027", "98–197"],
      ["#a50026", "197+"],
    ];
    html += `<div class="legend-block"><div class="legend-title">Snow Depth (in)</div><div class="legend-scale">`;
    depthRanges.forEach(([bg, label]) => {
      html += `<span class="legend-row"><span class="legend-item" style="background:${bg}"></span><span class="legend-label">${label}</span></span>`;
    });
    html += `</div></div>`;
  }
  if (hasSwe) {
    const sweRanges = [
      ["#e0f3f8", "0–0.04"],
      ["#abd9e9", "0.04–0.20"],
      ["#74add1", "0.20–0.39"],
      ["#4575b4", "0.39–0.98"],
      ["#313695", "0.98–2"],
      ["#fee090", "2–3.9"],
      ["#fdae61", "3.9–5.9"],
      ["#f46d43", "5.9–9.8"],
      ["#d73027", "9.8–20"],
      ["#a50026", "20+"],
    ];
    html += `<div class="legend-block"><div class="legend-title">Snow Water Equivalent (in)</div><div class="legend-scale">`;
    sweRanges.forEach(([bg, label]) => {
      html += `<span class="legend-row"><span class="legend-item" style="background:${bg}"></span><span class="legend-label">${label}</span></span>`;
    });
    html += `</div></div>`;
  }
  container.innerHTML = html;
}

map.on("overlayadd overlayremove", function (e) {
  if (e.layer === nohrscSnowDepth || e.layer === nohrscSnowWaterEquivalent) {
    updateLegend();
  }
});
