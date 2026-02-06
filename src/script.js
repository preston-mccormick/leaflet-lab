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
  }
);

const topo = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
  }
);

// Add default layer
osm.addTo(map);

// Layer control
const baseLayers = {
  "OpenStreetMap": osm,
  "Satellite": satellite,
  "Topographic": topo,
};

L.control.layers(baseLayers, null, { position: "topleft" }).addTo(map);