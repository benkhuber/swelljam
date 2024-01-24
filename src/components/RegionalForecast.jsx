import React, { useEffect, useState } from 'react';

function RegionalForecast() {
  const [rawBuoyData, setRawBuoyData] = useState([]);
  const [rawSpectralData, setRawSpectralData] = useState([]);
  const [rawBuoyStations, setRawBuoyStations] = useState([]);
  const [parsedBuoyStations, setParsedBuoyStations] = useState([]);
  const [currentConditions, setCurrentConditions] = useState({
    localDate: 'No Data',
    currentStationName: 'Not Available',
    currentStationLat: 'N/A',
    currentStationLon: 'N/A',
    significantHeight: 'No Data',
    dominantSwellDirection: 'No Data',
    peakPeriod: 'No Data',
    currentWaterTemperature: 'No Data',
    individualSwellHeight: 'No Data',
    individualSwellPeriod: 'No Data',
    individualSwellDirection: 'No Data',
    windSwellHeight: 'No Data',
    windSwellPeriod: 'No Data',
    windSwellDirection: 'No Data',
  });
  const currentStationId = '46253';

  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;
  const spectralApiURL = `http://localhost:3001/api/buoydata/spectral/${currentStationId}`;
  const buoyStationsURL = 'http://localhost:3001/api/buoydata/allstations';

  const fetchRawBuoyData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      setRawBuoyData(textData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const fetchRawSpectralBuoyData = async () => {
    try {
      const spectralResponse = await fetch(spectralApiURL);
      if (!spectralResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const spectralData = await spectralResponse.text();
      setRawSpectralData(spectralData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const fetchBuoyStations = async () => {
    try {
      const allBuoyStationsResponse = await fetch(buoyStationsURL);
      if (!allBuoyStationsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const allBuoyStationsRawData = await allBuoyStationsResponse.text();
      setRawBuoyStations(allBuoyStationsRawData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  const parseAllStationRawData = () => {
    const xmlString = rawBuoyStations;
    const buoyStations = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const stations = xmlDoc.getElementsByTagName('station');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      const id = station.getAttribute('id');
      const lat = station.getAttribute('lat');
      const lon = station.getAttribute('lon');
      const name = station.getAttribute('name');
      const type = station.getAttribute('type');

      if (type === 'buoy' && name.includes(', CA')) {
        const parsedBuoyStation = {
          id,
          lat,
          lon,
          name,
        };
        buoyStations.push(parsedBuoyStation);
      }
    }
    setParsedBuoyStations(buoyStations);
  };

  const updateStationDisplay = () => {
    const selectedStation = parsedBuoyStations.find((station) => station.id === currentStationId);
    if (selectedStation) {
      const updatedConditions = {
        ...currentConditions,
        currentStationName: selectedStation.name,
        currentStationLat: selectedStation.lat,
        currentStationLon: selectedStation.lon,
      };
      setCurrentConditions(updatedConditions);
    }
  };

  useEffect(() => {
    fetchRawBuoyData();
    fetchRawSpectralBuoyData();
    fetchBuoyStations();
  }, []);

  useEffect(() => {
    parseAllStationRawData();
  }, [rawBuoyStations]);

  useEffect(() => {
    updateStationDisplay();
    console.log(currentConditions.currentStationName);
  }, [parsedBuoyStations]);

  return (
    <div>
      <h2>Southern California Regional Forecast</h2>
      <h3>{ currentConditions.currentStationName }</h3>
    </div>
  );
}

export default RegionalForecast;
