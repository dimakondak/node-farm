const mapElement = document.getElementById('map');

const startLocation = JSON.parse(mapElement.dataset.startLocation);

const [lng, lat] = startLocation.coordinates;
const coordinates = [lat, lng];

const map = L.map('map', {
  scrollWheelZoom: false,
  zoomControl: false,
}).setView(coordinates, 13);

// tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

// marker
L.marker(coordinates)
  .addTo(map)
  .bindPopup(startLocation.description)
  .openPopup();
