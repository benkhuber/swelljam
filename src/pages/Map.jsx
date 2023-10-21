import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup,
} from 'react-leaflet';
import Header from '../components/Header';
import '../index.css';
import customIcon from '../icons/customIcon';

function Map() {
  const [data, setData] = useState([]);
  const [buoyStationData, setBuoyStationData] = useState([]);

  const parseAllStationRawData = (rawBuoyData) => {
    const xmlString = rawBuoyData;
    const parsedBuoyStations = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const stations = xmlDoc.getElementsByTagName('station');

    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const id = station.getAttribute('id');
      const lat = station.getAttribute('lat');
      const lon = station.getAttribute('lon');
      // const elev = station.getAttribute('elev');
      const name = station.getAttribute('name');
      // const owner = station.getAttribute('owner');
      // const pgm = station.getAttribute('pgm');
      const type = station.getAttribute('type');
      // const met = station.getAttribute('met');
      // const currents = station.getAttribute('currents');
      // const waterquality = station.getAttribute('waterquality');
      // const dart = station.getAttribute('dart');

      // Checks if station type is buoy. If true adds station info to parsedBuoyStations array
      if (type === 'buoy' && name.includes(', CA')) {
        const parsedBuoyStation = {
          id,
          lat,
          lon,
          name,
        };
        parsedBuoyStations.push(parsedBuoyStation);
      }
    }
    setBuoyStationData(parsedBuoyStations);
    console.log(buoyStationData);
  };

  const stationApiURL = 'http://localhost:3001/api/buoydata/allstations';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getData');
        const buoyStationsResponse = await (fetch(stationApiURL));
        if (!buoyStationsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        setData(response.data);
        const allBuoyStations = await buoyStationsResponse.text();
        parseAllStationRawData(allBuoyStations);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <MapContainer id="map" center={[33.6226, -117.9300]} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Marker with popup">
            <LayerGroup>
              {data.map((marker, index) => (
                <Marker
                  key={index}
                  position={[marker.spotLat, marker.spotLon]}
                >
                  <Popup>{marker.spotName}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Buoys">
            <LayerGroup>
              {buoyStationData.map((buoy, index) => (
                <Marker
                  key={index}
                  position={[buoy.lat, buoy.lon]}
                  icon={customIcon}
                >
                  <Popup className="popup">
                    Station ID: {buoy.id} <br />
                    Buoy Name: {buoy.name}
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default Map;
