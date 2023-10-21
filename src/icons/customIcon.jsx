import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: '/src/icons/mapMarker.png', // Provide the path to your custom icon image
  iconSize: [24, 24], // Adjust the size of the icon
  iconAnchor: [16, 32], // The point where the icon should be anchored
  popupAnchor: [0, -32], // The point from which the popup should open relative to the icon
});

export default customIcon;
