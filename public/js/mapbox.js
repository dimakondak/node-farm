import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const renderMap = (locations) => {
  const [lng, lat] = locations[0].coordinates;
  const coordinates = [lat, lng];

  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
  }).setView(coordinates, 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker(coordinates)
    .addTo(map)
    .bindPopup(locations[0].description)
    .openPopup();
};
