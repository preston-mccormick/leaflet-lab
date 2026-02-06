# Leaflet Map Lab

## Purpose

Just a lab repo to play with the JavaScript mapping library [Leaflet](https://leafletjs.com/)

### Tech Stack

Keeping it simple to focus on layout and JavaScript interactions.

- HTMLttttttttt

## Technical Notes

- Basemap

  - Uses [OpenStreetMap](https://www.openstreetmap.org/#map=15/40.000/-105.000) tiles
    - No API key or registration required!
    - Different basemap themes that can be specified

- Leaflet via CDN
  - Include Leaflet.css
    - Before your styles.css
  - Include Leaflet.js
    - At the end of body (after load) and before your script.js.
  - Map container
    - The map div must have a defined height. Leaflet won’t show until the container has dimensions.
  - Init order in script.js
    - Create map: L.map('map').setView([lat, lng], zoom).
    - Add OSM layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '...', maxZoom: 10 }).addTo(map)
      - Here {y} is the map style.

## Run

No server required. Open `index.html` in any browser.
