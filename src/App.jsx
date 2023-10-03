/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import './App.css';
// import BuoyData from './BuoyData';
import DominantSwellHeight from './DominantSwellHeight';
import Card from './Card';

function App() {
  const currentStationId = '46253';
  const [data, setData] = useState([]);
  const apiUrl = `http://localhost:3001/api/buoydata/realtime/${currentStationId}`;

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const textData = await response.text();
      setData(textData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log('DATA FETCH');
  }, []);

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
    return 'N'; // For degrees between 330 and 30
  };

  let significantHeight = null;
  let dominantSwellDirection = null;
  let peakPeriod = null;
  let currentWaterTemperature = null;

  const lines = data.toString().split('\n');

  for (const line of lines) {
    const values = line.trim().split(/\s+/);

    if (values.length === 19) {
      const waveHeight = values[8];
      const meanWaveDirection = values[11];
      const dominantPeriod = values[9];
      const waterTemperature = values[14];

      if (waveHeight !== 'WVHT') {
        if (waveHeight !== 'm') {
          significantHeight = `${(parseFloat(waveHeight) * 3.28084).toFixed(1)} ft`;
          dominantSwellDirection = `${getSwellDirectionLabel(parseFloat(meanWaveDirection))} (${parseFloat(meanWaveDirection)}°)`;
          peakPeriod = `${parseFloat(dominantPeriod)} s`;
          currentWaterTemperature = `${(parseFloat(waterTemperature) * (9 / 5) + 32).toFixed(0)}°F`;
          break;
        }
      }
    }
  }

  return (
    <div>
      <h1>SwellJam</h1>
      <div className="dataGrid">
        <Card value={significantHeight} description="Significant Height" />
        <Card value={peakPeriod} description="Peak Period" />
        <Card value={dominantSwellDirection} description="Mean Direction" />
        <Card value={currentWaterTemperature} description="Water Temperature" />
      </div>
    </div>
  );
}

export default App;
