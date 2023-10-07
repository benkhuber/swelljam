/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';
import SelectedBuoyInfo from './SelectedBuoyInfo';
import SpectralDataTable from './SpectralDataTable';
import SelectSpotMenu from './SelectSpotMenu';

function App() {
  const [data, setData] = useState([]);
  const [spectralData, setSpectralData] = useState([]);
  const [allStationData, setAllStationData] = useState([]);
  const [buoyStations, setBuoyStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('46253');

  // API URL for current conditions, includes dominant swell data
  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${selectedStationId}`;
  // API URL for spectral conditions, includes individual swell data
  const spectralApiUrl = `http://localhost:3001/api/buoydata/spectral/${selectedStationId}`;
  // API URL for stations,
  const stationApiURL = 'http://localhost:3001/api/buoydata/allstations';

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const spectralResponse = await (fetch(spectralApiUrl));
      const allStationsResponse = await (fetch(stationApiURL));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (!spectralResponse.ok) {
        throw new Error('Network response was not ok');
      }
      if (!allStationsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      const spectralTextData = await spectralResponse.text();
      const allStationsRawData = await allStationsResponse.text();
      setData(textData);
      setSpectralData(spectralTextData);
      setAllStationData(allStationsRawData);
      updateStationDisplay();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedStationId) {
      fetchData();
    }
  }, [selectedStationId]);

  // Initializes current conditions object with placeholder values. API request will update values.
  const currentConditions = {
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
  };

  const updateStationDisplay = () => {
    const selectedStation = buoyStations.find((station) => station.id === selectedStationId);
    if (selectedStation) {
      currentConditions.currentStationName = selectedStation.name;
      currentConditions.currentStationLat = selectedStation.lat;
      currentConditions.currentStationLon = selectedStation.lon;
    }
  };

  // Inputs the swell direction as a param and outputs a cardinal description.
  const getSwellDirectionLabel = (degrees) => {
    if (degrees >= 30 && degrees < 60) {
      return 'NE';
    } if (degrees >= 60 && degrees < 120) {
      return 'E';
    } if (degrees >= 120 && degrees < 150) {
      return 'SE';
    } if (degrees >= 150 && degrees < 210) {
      return 'S';
    } if (degrees >= 210 && degrees < 240) {
      return 'SW';
    } if (degrees >= 240 && degrees < 300) {
      return 'W';
    } if (degrees >= 300 && degrees < 330) {
      return 'NW';
    }
    return 'N';
  };

  const parseDominantSwellData = () => {
  // API request returns a text file. Splits the text into lines based off line breaks
    const lines = data.toString().split('\n');

    // Loops through lines and splits at white space.
    for (const line of lines) {
      const values = line.trim().split(/\s+/);

      // Length checks that all columns are present
      if (values.length === 19) {
        const year = values[0];
        const month = values[1];
        const day = values[2];
        const hour = values[3];
        const minute = values[4];
        const waveHeight = values[8];
        const meanWaveDirection = values[11];
        const dominantPeriod = values[9];
        const waterTemperature = values[14];

        // Checks to see if waveHeight is a header value. Once it reaches numerical value, the
        // current conditions values are updated with numeric values.
        if (waveHeight !== 'WVHT') {
          if (waveHeight !== 'm') {
            const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
            const localDate = new Date(utcDate);
            currentConditions.currentDate = localDate;
            if (waveHeight === 'MM') {
              currentConditions.significantHeight = 'No Data';
            } else {
              currentConditions.significantHeight = `${(parseFloat(waveHeight) * 3.28084).toFixed(1)} ft`;
            }
            if (meanWaveDirection === 'MM') {
              currentConditions.dominantSwellDirection = 'No Data';
            } else {
              currentConditions.dominantSwellDirection = `${getSwellDirectionLabel(parseFloat(meanWaveDirection))} (${parseFloat(meanWaveDirection)}°)`;
            }
            if (dominantPeriod === 'MM') {
              currentConditions.peakPeriod = 'No Data';
            } else {
              currentConditions.peakPeriod = `${parseFloat(dominantPeriod)} s`;
            }
            if (waterTemperature === 'MM') {
              currentConditions.waterTemperature = 'No Data';
            } else {
              currentConditions.currentWaterTemperature = `${(parseFloat(waterTemperature) * (9 / 5) + 32).toFixed(0)}°F`;
            }
            break;
          }
        }
      }
    }
  };

  const parseSpectralSwellData = () => {
    // API request returns a text file. Splits the text into lines based off line breaks
    const lines = spectralData.toString().split('\n');

    // Loops through lines and splits at white space.
    for (const line of lines) {
      const values = line.trim().split(/\s+/);

      // Length checks that all columns are present
      if (values.length === 15) {
        const swellHeight = values[6];
        const swellPeriod = values[7];
        const windWaveHeight = values[8];
        const windWavePeriod = values[9];
        const swellDirection = values[10];
        const windWaveDirection = values[11];

        if (swellHeight !== 'SwH') {
          if (swellHeight !== 'm') {
            updateStationDisplay();
            currentConditions.individualSwellHeight = `${(parseFloat(swellHeight) * 3.28084).toFixed(1)} ft`;
            currentConditions.individualSwellPeriod = `${parseFloat(swellPeriod)} s`;
            currentConditions.individualSwellDirection = swellDirection;
            currentConditions.windSwellHeight = `${(parseFloat(windWaveHeight) * 3.28084).toFixed(1)} ft`;
            currentConditions.windSwellPeriod = `${parseFloat(windWavePeriod)} s`;
            currentConditions.windSwellDirection = windWaveDirection;
          }
        }
      }
    }
  };

  const parseAllStationRawData = () => {
    const xmlString = allStationData;
    const parsedBuoyStations = [];
    // Create a DOMParser instance
    const parser = new DOMParser();

    // Parse the XML string
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Extract data from the XML document
    const stations = xmlDoc.getElementsByTagName('station');

    // Iterate through the stations and extract attributes
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
    setBuoyStations(parsedBuoyStations);
  };

  parseDominantSwellData();
  parseSpectralSwellData();

  // Calls the parseAllStationRawData function when allStationData changes
  useEffect(() => {
    if (allStationData) {
      parseAllStationRawData();
    }
  }, [allStationData]);

  const handleStationChange = (e) => {
    setSelectedStationId(e.target.value);
  };

  return (
    <div>
      <h1>SwellJam</h1>
      <SelectSpotMenu />
      <div>Select your local buoy:</div>
      <select value={selectedStationId} onChange={handleStationChange}>
        {buoyStations.map((station, index) => (
          <option key={index} value={station.id}>
            {station.name}
          </option>
        ))};
      </select>
      <SelectedBuoyInfo
        stationName={currentConditions.currentStationName}
        stationLat={currentConditions.currentStationLat}
        stationLon={currentConditions.currentStationLon}
        localDate={currentConditions.currentDate}
      />
      <div className="dataGrid">
        <Card
          value={currentConditions.significantHeight}
          description="Significant Height"
        />
        <Card
          value={currentConditions.peakPeriod}
          description="Peak Period"
        />
        <Card
          value={currentConditions.dominantSwellDirection}
          description="Mean Direction"
        />
        <Card
          value={currentConditions.currentWaterTemperature}
          description="Water Temperature"
        />
      </div>
      <SpectralDataTable
        indSwellHeight={currentConditions.individualSwellHeight}
        indSwellPeriod={currentConditions.individualSwellPeriod}
        indSwellDirection={currentConditions.individualSwellDirection}
        windSwellHeight={currentConditions.windSwellHeight}
        windSwellPeriod={currentConditions.windSwellPeriod}
        windSwellDirection={currentConditions.windSwellDirection}
      />
    </div>
  );
}

export default App;
