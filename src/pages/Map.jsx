import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import Header from '../components/Header';
import '../index.css';

function Map() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getData');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  return (
    <div>
      <Header />
      <MapContainer id="map" center={[33.6226, -117.9300]} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.spotLat, marker.spotLon]}
          >
            <Popup>{marker.spotName}</Popup>

          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;